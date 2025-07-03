const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../config/db");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const login = (req, res) => {
  const { email, password } = req.body;

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
        return res
          .status(404)
          .json({ message: "Username or Password is Incorrect" });
      }

      if (user.two_fa === true) {
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const otpToken = crypto.randomBytes(20).toString("hex");
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 minutes

        // Store OTP in DB (you can create a table: otp_tokens with columns: email, otp, token, expires_at)
        await db.query(
          `INSERT INTO otp_tokens (email, otp, token, expires_at) VALUES ($1, $2, $3, $4)`,
          [email, otp, otpToken, expiresAt]
        );

        // Send email with OTP
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"SPNotz" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "🔐 Your OTP Code from SPNotz",
          text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
          html: `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
      
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://backend-notepad.vercel.app/logo" alt="SPNotz Logo" style="max-width: 150px;" />
      </div>

      <h2 style="color: #2f855a; text-align: center;">🔐 One-Time Password (OTP)</h2>
      
      <p style="font-size: 16px; color: #333; text-align: center;">
        Use the following OTP to proceed with your verification.
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #2d3748; padding: 15px 30px; background-color: #edf2f7; border: 2px dashed #2f855a; border-radius: 8px;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center;">
        This OTP is valid for <strong>5 minutes</strong>.<br />
        If you did not request this, please ignore this email.
      </p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} SPNotz. All rights reserved.
      </p>
    </div>
  `,
        });

        return res.status(200).json({
          "two-fa": true,
          message: "OTP sent to email",
          otpToken, // return this for frontend to use when verifying
        });
      } else {
        // No 2FA: proceed to login
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
      }
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = { login };
