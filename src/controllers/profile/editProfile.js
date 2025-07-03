const db = require("../../config/db"); // Assuming db is a pg.Pool instance

const editProfile = async (req, res) => {
  const { name, two_fa, email, loginId } = req.body;
  console.log(req.body)

  const updateQuery = `
    UPDATE login
    SET name = $1, two_fa = $2, email = $3
    WHERE id = $4
  `;

  try {
    const result = await db.query(updateQuery, [name, two_fa, email, loginId]);
    
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
