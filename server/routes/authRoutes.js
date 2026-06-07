const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  sendOtp,
  verifyOtp,
  register,
  login,
  googleLogin,
  getMe,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", auth, getMe);

module.exports = router;
