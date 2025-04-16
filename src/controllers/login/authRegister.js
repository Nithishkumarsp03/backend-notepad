const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const register = async (req, res) => {
  const { name, email, password, twofa, gender, category_id } = req.body;

  if (!name || !email || !password || !gender || !category_id) {
    return res.status(400).json({
      status: "fail",
      message: "Required fields: name, email, password, gender, and category_id",
    });
  }

  try {
    // Check if email already exists
    const checkQuery = "SELECT 1 FROM login WHERE email = $1";
    const { rowCount } = await db.query(checkQuery, [email]);

    if (rowCount > 0) {
      return res.status(409).json({
        status: "fail",
        message: "Email already registered. Please use a different one or login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      INSERT INTO login (name, email, password, two_fa, gender, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, gender
    `;
    const values = [name, email, hashedPassword, twofa || false, gender, category_id];
    const { rows } = await db.query(insertQuery, values);
    const user = rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        ID: user.id,
        EMAIL: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user,
      token,
    });

  } catch (err) {
    console.error("[REGISTER ERROR]", {
      message: err.message,
      stack: err.stack,
      context: {
        requestBody: req.body,
      },
    });

    return res.status(500).json({
      status: "error",
      message: "Something went wrong during registration. Please try again later.",
    });
  }
};

module.exports = { register };
