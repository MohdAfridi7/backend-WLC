const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// 🔐 TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// ✅ LOGIN
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ msg: "Invalid Email" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });

  const token = generateToken(admin._id);

  res.json({
    msg: "Login Success",
    token,
  });
};


// 📩 STEP 1 → SEND OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ msg: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  admin.otp = otp;
  admin.otpExpire = Date.now() + 5 * 60 * 1000;
  admin.isOtpVerified = false;

  await admin.save();

await sendEmail({
  to: email,
  subject: "Password Reset OTP",
  html: `<h2>Your OTP is ${otp}</h2>`,
});

  res.json({ msg: "OTP sent to email" });
};


// 🔐 STEP 2 → VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin || admin.otp !== otp)
    return res.status(400).json({ msg: "Invalid OTP" });

  if (admin.otpExpire < Date.now())
    return res.status(400).json({ msg: "OTP expired" });

  admin.isOtpVerified = true;
  await admin.save();

  res.json({ msg: "OTP verified successfully" });
};


// 🔄 STEP 3 → RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ msg: "Admin not found" });

  if (!admin.isOtpVerified)
    return res.status(400).json({ msg: "OTP not verified" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  admin.password = hashedPassword;
  admin.otp = null;
  admin.otpExpire = null;
  admin.isOtpVerified = false;

  await admin.save();

  res.json({ msg: "Password updated successfully" });
};


// 📧 CHANGE EMAIL → SEND OTP
exports.sendEmailChangeOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;

    // ✅ YAHAN lagani hai (TOP pe)
    if (!req.admin || !req.admin.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.emailChangeOtp = otp;
    admin.emailChangeOtpExpire = Date.now() + 5 * 60 * 1000;
    admin.newEmail = newEmail;

    await admin.save();

await sendEmail({
  to: newEmail,
  subject: "Change Email OTP",
  html: `<h2>Your OTP is ${otp}</h2>`,
});

    res.json({ msg: "OTP sent to new email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ VERIFY EMAIL CHANGE
exports.verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;

    // ✅ YAHAN bhi lagani hai
    if (!req.admin || !req.admin.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    if (admin.emailChangeOtp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (admin.emailChangeOtpExpire < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    admin.email = admin.newEmail;
    admin.newEmail = null;
    admin.emailChangeOtp = null;
    admin.emailChangeOtpExpire = null;

    await admin.save();

    res.json({ msg: "Email updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};