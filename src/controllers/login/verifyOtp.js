const db = require("../../config/db");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {
  const { email, otp, otpToken } = req.body;

  if (!email || !otp || !otpToken) {
    return res.status(400).json({ message: "Email, OTP, and token are required." });
  }

  const result = await db.query(
    `SELECT * FROM otp_tokens WHERE email = $1 AND otp = $2 AND token = $3`,
    [email, otp, otpToken]
  );

  const tokenData = result.rows[0];

  if (!tokenData) {
    return res.status(401).json({ message: "Invalid OTP or token." });
  }

  if (new Date() > new Date(tokenData.expires_at)) {
    return res.status(410).json({ message: "OTP has expired." });
  }

  // OTP valid, delete it
  await db.query(`DELETE FROM otp_tokens WHERE token = $1`, [otpToken]);

  // Fetch user again and issue final JWT
  const userResult = await db.query(`SELECT * FROM login WHERE email = $1`, [email]);
  const user = userResult.rows[0];

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

  return res.status(200).json({ token, userData });
};

module.exports = { verifyOtp };
