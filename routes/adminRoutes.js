const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  sendOtp,
  verifyOtp,          // ✅ ADD THIS
  resetPassword,
  sendEmailChangeOtp,
  verifyEmailChange,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// 🔐 LOGIN
router.post("/login", loginAdmin);

// 🔥 FORGET PASSWORD FLOW (3 STEP)
router.post("/forgot-password", sendOtp);     // Step 1
router.post("/verify-otp", verifyOtp);        // Step 2 ✅ NEW
router.post("/reset-password", resetPassword);// Step 3

// 📧 CHANGE EMAIL
router.post("/change-email", protect, sendEmailChangeOtp);
router.post("/verify-email", protect, verifyEmailChange);

module.exports = router;