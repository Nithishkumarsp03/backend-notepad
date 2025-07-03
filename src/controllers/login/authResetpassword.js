const db = require("../../config/db");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  const user = await db.query(
    "SELECT login_id FROM password_resets WHERE token = $1",
    [token]
  );
  if (!user.rows[0]) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const login_id = user.rows[0].login_id;

  const query = `UPDATE login SET password = $1 WHERE id = $2`;
  const result = await db.query(query, [hashedPassword, login_id]);
  if (result.rowCount === 0) {
    return res.status(400).json({ message: "Invalid token" });
  }
  await db.query("DELETE FROM password_resets WHERE token = $1", [token]);
  return res.json({ message: "Password updated successfully" });
};

module.exports = { resetPassword };
