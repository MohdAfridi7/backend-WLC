const express = require("express");
const router = express.Router();

const upload = require(
  "../middleware/uploadGfetsc"
);

const { protect } = require("../middleware/authMiddleware");

const {
  createGfetsc,
  getAllGfetscs,
  getGfetscById,
  updateGfetsc,
  deleteGfetsc,
} = require(
  "../controllers/gfetscController"
);

// Public Routes
router.get("/", getAllGfetscs);
router.get("/:id", getGfetscById);

// Protected Routes
router.post(
  "/",
  protect,
  upload.single("image"),
  createGfetsc
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateGfetsc
);

router.delete(
  "/:id",
  protect,
  deleteGfetsc
);

module.exports = router;