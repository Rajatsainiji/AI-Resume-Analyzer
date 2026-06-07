const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendOtpEmail = async (email, otp, name) => {
  const transporter = createTransporter();
  const subject = "Verify your email — Resume ATS Analyzer";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#2563eb;">Resume ATS Analyzer</h2>
      <p>Hi ${name || "there"},</p>
      <p>Your email verification code is:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0f172a;">${otp}</p>
      <p style="color:#64748b;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[DEV OTP] ${email}: ${otp}`);
    return { devMode: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    html,
  });

  return { devMode: false };
};

module.exports = { sendOtpEmail };
