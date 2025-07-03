const db = require("../../config/db");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const requestReset = async (req, res) => {
  const { loginId } = req.body;

  const user = await db.query("SELECT email FROM login WHERE id = $1", [loginId]);

  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const email = user.rows[0].email;
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await db.query(
    `
        INSERT INTO password_resets (login_id, token, expires_at)
        VALUES ($1, $2, $3)
    `,
    [loginId, token, expiresAt]
  );

  const resetLink = `${process.env.SERVER_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 await transporter.sendMail({
  to: email,
  from: `"SPNotz" <${process.env.EMAIL_USER}>`,
  subject: "Reset Your SPNotz Account Password",
  html: `
  <div style="font-family: 'Inter', sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <h2 style="color: #2d3748; text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
      <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
        Hello,<br><br>
        We received a request to reset the password associated with your SPNotz account.
        You can reset your password by clicking the button below. This link is valid for <strong>15 minutes</strong>.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #4a5568; font-size: 14px; line-height: 1.5;">
        If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above and create a new one.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      <p style="text-align: center; color: #a0aec0; font-size: 12px;">
        © ${new Date().getFullYear()} SPNotz. All rights reserved.
      </p>
    </div>
  </div>
  `,
});

  res.json({ message: "Password reset link sent" });
};

module.exports = { requestReset };
