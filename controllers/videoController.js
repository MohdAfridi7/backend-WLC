const Video = require("../models/videoModel");

const getYoutubeThumbnail = (url) => {
  try {
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    }

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch (error) {
    return "";
  }
};

// CREATE
exports.createVideo = async (req, res) => {
  try {
    const {
      title,
      youtubeLink,
      shortDescription,
      content,
    } = req.body;

    const thumbnail =
      getYoutubeThumbnail(youtubeLink);

    const video = await Video.create({
      title,
      youtubeLink,
      thumbnail,
      shortDescription,
      content,
    });

    return res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(
      req.params.id
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.updateVideo = async (req, res) => {
  try {
    const {
      title,
      youtubeLink,
      shortDescription,
      content,
    } = req.body;

    const thumbnail =
      getYoutubeThumbnail(youtubeLink);

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        youtubeLink,
        thumbnail,
        shortDescription,
        content,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(
      req.params.id
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    await Video.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};