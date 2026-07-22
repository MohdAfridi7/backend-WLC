const cloudinary = require("../config/cloudinary");
const Summit = require("../models/summitModel");

// CREATE
exports.createSummit = async (req, res) => {
  try {
    const { title, description, day } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const uploadedImage =
      await cloudinary.uploader.upload(
        base64File,
        {
          folder: "WLC/Summit",
        }
      );

const summit = await Summit.create({
  title,
  description,
  day,
  image: uploadedImage.secure_url,
  imagePublicId: uploadedImage.public_id,
});

    return res.status(201).json({
      success: true,
      data: summit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllSummits = async (
  req,
  res
) => {
  try {
    const summits = await Summit.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: summits.length,
      data: summits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE
exports.getSummitById = async (
  req,
  res
) => {
  try {
    const summit = await Summit.findById(
      req.params.id
    );

    if (!summit) {
      return res.status(404).json({
        success: false,
        message: "Summit not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: summit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.updateSummit = async (
  req,
  res
) => {
  try {
    const summit = await Summit.findById(
      req.params.id
    );

    if (!summit) {
      return res.status(404).json({
        success: false,
        message: "Summit not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(
        summit.imagePublicId
      );

      const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const uploadedImage =
        await cloudinary.uploader.upload(
          base64File,
          {
            folder: "WLC/Summit",
          }
        );

      summit.image =
        uploadedImage.secure_url;

      summit.imagePublicId =
        uploadedImage.public_id;
    }

    summit.title =
      req.body.title || summit.title;

    summit.description =
      req.body.description ||
      summit.description;

      summit.day = req.body.day || summit.day;

    await summit.save();

    return res.status(200).json({
      success: true,
      data: summit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.deleteSummit = async (
  req,
  res
) => {
  try {
    const summit = await Summit.findById(
      req.params.id
    );

    if (!summit) {
      return res.status(404).json({
        success: false,
        message: "Summit not found",
      });
    }

    await cloudinary.uploader.destroy(
      summit.imagePublicId
    );

    await Summit.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Summit deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};