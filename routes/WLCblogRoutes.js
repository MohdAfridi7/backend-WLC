const express = require("express");
const router = express.Router();

const upload = require("../middleware/WLCuploadBlog");
const { protect } = require("../middleware/authMiddleware");

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getRelatedBlogs,
    getRecentBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/WLCblogController");

// Public
router.get("/", getAllBlogs);
router.get("/recent", getRecentBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/related/:id", getRelatedBlogs);
router.get("/:id", getBlogById);

// Protected
router.post(
  "/",
  protect,
  upload.single("image"),
  createBlog
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateBlog
);

router.delete(
  "/:id",
  protect,
  deleteBlog
);

module.exports = router;