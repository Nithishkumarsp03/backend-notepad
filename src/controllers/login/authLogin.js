const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../config/db");

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = "SELECT * FROM login WHERE email = $1";
  const values = [email];

  db.query(query, values, async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Username or Password is Incorrect" });
      }

      const token = jwt.sign(
        {
          ID: user.id,
          EMAIL: user.email,
          updatedAt: user.updated_at,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      const userData = {
        name: user.name,
        email: user.email,
        id: user.id,
        gender: user.gender,
      };

      res.status(200).json({ token, userData });
    } catch (compareErr) {
      console.error("Password compare error:", compareErr);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = { login };
