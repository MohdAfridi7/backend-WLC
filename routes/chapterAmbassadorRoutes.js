const express = require("express");
const router = express.Router();

const upload = require(
  "../middleware/uploadChapterAmbassador"
);

const { protect } = require("../middleware/authMiddleware");

const {
  createChapterAmbassador,
  getAllChapterAmbassadors,
  getChapterAmbassadorById,
  updateChapterAmbassador,
  deleteChapterAmbassador,
} = require(
  "../controllers/chapterAmbassadorController"
);

// Public
router.get("/", getAllChapterAmbassadors);
router.get("/:id", getChapterAmbassadorById);

// Protected
router.post(
  "/",
  protect,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "flagImage",
      maxCount: 1,
    },
  ]),
  createChapterAmbassador
);

router.put(
  "/:id",
  protect,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "flagImage",
      maxCount: 1,
    },
  ]),
  updateChapterAmbassador
);

router.delete(
  "/:id",
  protect,
  deleteChapterAmbassador
);

module.exports = router;