const Blog = require("../models/WLCblogModel");
const cloudinary = require("../config/cloudinary");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const {
  title,
  authorName,
  category,
  postDate,
  shortDescription,
  content,
  readTime,
} = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploadedImage =
      await cloudinary.uploader.upload(base64Image, {
        folder: "WLC/Blogs",
      });

 const blog = await Blog.create({
  title,
  slug: generateSlug(title),
  authorName,
  category,
  postDate,
  shortDescription,
  content,
  readTime,
  image: uploadedImage.secure_url,
  imagePublicId: uploadedImage.public_id,
});

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET RECENT 5 BLOGS
exports.getRecentBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BLOG BY SLUG
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RELATED BLOGS
exports.getRelatedBlogs = async (req, res) => {
  try {
    const currentBlog =
      await Blog.findById(req.params.id);

    const blogs = await Blog.find({
      category: currentBlog.category,
      _id: { $ne: req.params.id },
    })
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(
        blog.imagePublicId
      );

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const uploadedImage =
        await cloudinary.uploader.upload(
          base64Image,
          {
            folder: "WLC/Blogs",
          }
        );

      blog.image = uploadedImage.secure_url;
      blog.imagePublicId =
        uploadedImage.public_id;
    }

   blog.title = req.body.title || blog.title;

blog.slug = generateSlug(blog.title);

blog.authorName =
  req.body.authorName ||
  blog.authorName;

blog.category =
  req.body.category ||
  blog.category;

blog.postDate =
  req.body.postDate ||
  blog.postDate;

blog.shortDescription =
  req.body.shortDescription ||
  blog.shortDescription;

blog.content =
  req.body.content ||
  blog.content;

blog.readTime =
  req.body.readTime ||
  blog.readTime;

await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await cloudinary.uploader.destroy(
      blog.imagePublicId
    );

    await Blog.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};