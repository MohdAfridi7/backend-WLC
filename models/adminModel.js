const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // 🔐 OTP for forgot password
  otp: String,
  otpExpire: Date,
  isOtpVerified: {
    type: Boolean,
    default: false,
  },

  // 📧 Email Change
  emailChangeOtp: String,
  emailChangeOtpExpire: Date,
  newEmail: String,

}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);