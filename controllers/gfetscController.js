const cloudinary = require("../config/cloudinary");
const Gfetsc = require("../models/gfetsc");

// CREATE
exports.createGfetsc = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const uploadedImage = await cloudinary.uploader.upload(base64File, {
      folder: "WLC/Gfetsc",
    });

    const gfetsc = await Gfetsc.create({
      title,
      description,
      image: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,
    });

    return res.status(201).json({
      success: true,
      data: gfetsc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllGfetscs = async (req, res) => {
  try {
    const items = await Gfetsc.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE
exports.getGfetscById = async (req, res) => {
  try {
    const gfetsc = await Gfetsc.findById(req.params.id);

    if (!gfetsc) {
      return res.status(404).json({
        success: false,
        message: "Gfetsc not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gfetsc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.updateGfetsc = async (req, res) => {
  try {
    const gfetsc = await Gfetsc.findById(req.params.id);

    if (!gfetsc) {
      return res.status(404).json({
        success: false,
        message: "Gfetsc not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(gfetsc.imagePublicId);

      const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const uploadedImage = await cloudinary.uploader.upload(base64File, {
        folder: "WLC/Gfetsc",
      });

      gfetsc.image = uploadedImage.secure_url;
      gfetsc.imagePublicId = uploadedImage.public_id;
    }

    gfetsc.title = req.body.title || gfetsc.title;
    gfetsc.description = req.body.description || gfetsc.description;

    await gfetsc.save();

    return res.status(200).json({
      success: true,
      data: gfetsc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.deleteGfetsc = async (req, res) => {
  try {
    const gfetsc = await Gfetsc.findById(req.params.id);

    if (!gfetsc) {
      return res.status(404).json({
        success: false,
        message: "Gfetsc not found",
      });
    }

    await cloudinary.uploader.destroy(gfetsc.imagePublicId);
    await Gfetsc.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Gfetsc deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};