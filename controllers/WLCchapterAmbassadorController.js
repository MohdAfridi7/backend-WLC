const cloudinary = require("../config/cloudinary");
const ChapterAmbassador = require("../models/WLCchapterAmbassadorModel");

// CREATE
exports.createChapterAmbassador = async (req, res) => {
  try {
    const {
      name,
      country,
      designation,
      description,
    } = req.body;

    if (!req.files.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const profileBase64 = `data:${
      req.files.profileImage[0].mimetype
    };base64,${req.files.profileImage[0].buffer.toString(
      "base64"
    )}`;

    const uploadedProfile =
      await cloudinary.uploader.upload(
        profileBase64,
        {
          folder: "WLC/ChapterAmbassador/Profile",
        }
      );

    // flag image is optional
    let uploadedFlag = null;
    if (req.files.flagImage) {
      const flagBase64 = `data:${
        req.files.flagImage[0].mimetype
      };base64,${req.files.flagImage[0].buffer.toString(
        "base64"
      )}`;

      uploadedFlag = await cloudinary.uploader.upload(
        flagBase64,
        {
          folder: "WLC/ChapterAmbassador/Flags",
        }
      );
    }

    const ambassador =
      await ChapterAmbassador.create({
        name,
        country,
        designation,
        description,

        profileImage:
          uploadedProfile.secure_url,

        profileImagePublicId:
          uploadedProfile.public_id,

        flagImage: uploadedFlag
          ? uploadedFlag.secure_url
          : undefined,

        flagImagePublicId: uploadedFlag
          ? uploadedFlag.public_id
          : undefined,
      });

    res.status(201).json({
      success: true,
      data: ambassador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllChapterAmbassadors =
  async (req, res) => {
    try {
      const ambassadors =
        await ChapterAmbassador.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: ambassadors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET SINGLE
exports.getChapterAmbassadorById =
  async (req, res) => {
    try {
      const ambassador =
        await ChapterAmbassador.findById(
          req.params.id
        );

      if (!ambassador) {
        return res.status(404).json({
          success: false,
          message: "Not found",
        });
      }

      res.status(200).json({
        success: true,
        data: ambassador,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// UPDATE
exports.updateChapterAmbassador =
  async (req, res) => {
    try {
      const ambassador =
        await ChapterAmbassador.findById(
          req.params.id
        );

      if (!ambassador) {
        return res.status(404).json({
          success: false,
          message: "Not found",
        });
      }

      if (req.files?.profileImage) {
        if (ambassador.profileImagePublicId) {
          await cloudinary.uploader.destroy(
            ambassador.profileImagePublicId
          );
        }

        const profileBase64 = `data:${
          req.files.profileImage[0].mimetype
        };base64,${req.files.profileImage[0].buffer.toString(
          "base64"
        )}`;

        const uploadedProfile =
          await cloudinary.uploader.upload(
            profileBase64,
            {
              folder:
                "WLC/ChapterAmbassador/Profile",
            }
          );

        ambassador.profileImage =
          uploadedProfile.secure_url;

        ambassador.profileImagePublicId =
          uploadedProfile.public_id;
      }

      if (req.files?.flagImage) {
        if (ambassador.flagImagePublicId) {
          await cloudinary.uploader.destroy(
            ambassador.flagImagePublicId
          );
        }

        const flagBase64 = `data:${
          req.files.flagImage[0].mimetype
        };base64,${req.files.flagImage[0].buffer.toString(
          "base64"
        )}`;

        const uploadedFlag =
          await cloudinary.uploader.upload(
            flagBase64,
            {
              folder:
                "WLC/ChapterAmbassador/Flags",
            }
          );

        ambassador.flagImage =
          uploadedFlag.secure_url;

        ambassador.flagImagePublicId =
          uploadedFlag.public_id;
      }

      ambassador.name =
        req.body.name || ambassador.name;

      ambassador.country =
        req.body.country ||
        ambassador.country;

      ambassador.designation =
        req.body.designation ||
        ambassador.designation;

      ambassador.description =
        req.body.description ||
        ambassador.description;

      await ambassador.save();

      res.status(200).json({
        success: true,
        data: ambassador,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE
exports.deleteChapterAmbassador =
  async (req, res) => {
    try {
      const ambassador =
        await ChapterAmbassador.findById(
          req.params.id
        );

      if (!ambassador) {
        return res.status(404).json({
          success: false,
          message: "Not found",
        });
      }

      if (ambassador.profileImagePublicId) {
        await cloudinary.uploader.destroy(
          ambassador.profileImagePublicId
        );
      }

      if (ambassador.flagImagePublicId) {
        await cloudinary.uploader.destroy(
          ambassador.flagImagePublicId
        );
      }

      await ChapterAmbassador.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };