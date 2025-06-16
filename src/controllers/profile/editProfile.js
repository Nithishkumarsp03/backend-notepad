const db = require("../../config/db"); // Assuming db is a pg.Pool instance
const bcrypt = require("bcrypt");

const editProfile = async (req, res) => {
  const { name, password, two_fa, email, loginId } = req.body;
  console.log(req.body)
  const hashedPassword = await bcrypt.hash(password, 10);

  const updateQuery = `
    UPDATE login
    SET name = $1, password = $2, two_fa = $3, email = $4
    WHERE id = $5
  `;

  try {
    const result = await db.query(updateQuery, [name, hashedPassword, two_fa, email, loginId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { editProfile };
