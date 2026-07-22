const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadChapterAmbassador");
const { protect } = require("../middleware/authMiddleware");

const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

// Public Routes
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);

// Protected Routes
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
  createTeamMember
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
  updateTeamMember
);

router.delete(
  "/:id",
  protect,
  deleteTeamMember
);

module.exports = router;