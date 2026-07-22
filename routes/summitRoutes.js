const express = require("express");
const router = express.Router();

const upload = require(
  "../middleware/uploadSummit"
);

const { protect } = require("../middleware/authMiddleware");

const {
  createSummit,
  getAllSummits,
  getSummitById,
  updateSummit,
  deleteSummit,
} = require(
  "../controllers/summitController"
);

// Public Routes
router.get("/", getAllSummits);
router.get("/:id", getSummitById);

// Protected Routes
router.post(
  "/",
  protect,
  upload.single("image"),
  createSummit
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateSummit
);

router.delete(
  "/:id",
  protect,
  deleteSummit
);

module.exports = router;