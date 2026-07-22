const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadResume");
const { protect } = require("../middleware/authMiddleware");

const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication,
} = require("../controllers/applicationController");

// Public Route
router.post(
  "/apply",
  upload.single("resume"),
  submitApplication
);

// Protected Routes
router.get("/all", protect, getAllApplications);
router.get("/:id", protect, getApplicationById);
router.delete("/:id", protect, deleteApplication);

module.exports = router;