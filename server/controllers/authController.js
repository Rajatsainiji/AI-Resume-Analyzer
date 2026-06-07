const User = require("../models/User");
const OtpVerification = require("../models/OtpVerification");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { sendOtpEmail } = require("../utils/emailService");
const { sendAuthResponse } = require("../utils/tokenHelper");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

exports.sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpVerification.findOneAndUpdate(
      { email: normalizedEmail },
      { name: name.trim(), passwordHash, otpHash, expiresAt },
      { upsert: true, new: true }
    );

    const mailResult = await sendOtpEmail(
      normalizedEmail,
      otp,
      name.trim()
    );

    res.json({
      message: mailResult.devMode
        ? "OTP generated (check server console in dev mode)"
        : "OTP sent to your email",
      devMode: mailResult.devMode,
      ...(mailResult.devMode && process.env.NODE_ENV !== "production"
        ? { devOtp: otp }
        : {}),
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const record = await OtpVerification.findOne({
      email: normalizedEmail,
    });

    if (!record) {
      return res.status(400).json({
        message: "No OTP request found. Please register again.",
      });
    }

    if (record.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    const validOtp = await bcrypt.compare(otp, record.otpHash);
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name: record.name,
      email: normalizedEmail,
      password: record.passwordHash,
      isVerified: true,
    });

    await OtpVerification.deleteOne({ email: normalizedEmail });

    sendAuthResponse(res, user);
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ message: "Verification failed" });
  }
};

exports.register = async (req, res) => {
  res.status(400).json({
    message: "Use OTP verification. Call /auth/send-otp then /auth/verify-otp",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (user.isVerified === false) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    sendAuthResponse(res, user);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        message: "Google login not configured on server",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        isVerified: true,
      });
    }

    sendAuthResponse(res, user);
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(401).json({ message: "Google login failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email avatar"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
