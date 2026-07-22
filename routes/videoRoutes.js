const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");

// Public Routes
router.get("/", getAllVideos);
router.get("/:id", getVideoById);

// Protected Routes
router.post("/", protect, createVideo);

router.put("/:id", protect, updateVideo);

router.delete("/:id", protect, deleteVideo);

module.exports = router;