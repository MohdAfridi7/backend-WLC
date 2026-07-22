const cloudinary = require("../config/cloudinary");
const Team = require("../models/teamModel");

// CREATE TEAM MEMBER
exports.createTeamMember = async (req, res) => {
  try {
    const {
      name,
      country,
      designation,
      description,
    } = req.body;

    if (!req.files?.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile Image is required",
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
          folder: "WLC/Team/Profile",
        }
      );

    // flag image is optional
    let uploadedFlag = null;
    if (req.files?.flagImage) {
      const flagBase64 = `data:${
        req.files.flagImage[0].mimetype
      };base64,${req.files.flagImage[0].buffer.toString(
        "base64"
      )}`;

      uploadedFlag = await cloudinary.uploader.upload(
        flagBase64,
        {
          folder: "WLC/Team/Flags",
        }
      );
    }

    const teamMember = await Team.create({
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

    return res.status(201).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TEAM MEMBERS
exports.getAllTeamMembers = async (
  req,
  res
) => {
  try {
    const members = await Team.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE TEAM MEMBER
exports.getTeamMemberById = async (
  req,
  res
) => {
  try {
    const member = await Team.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TEAM MEMBER
exports.updateTeamMember = async (
  req,
  res
) => {
  try {
    const member = await Team.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Profile Image Update
    if (req.files?.profileImage) {
      if (member.profileImagePublicId) {
        await cloudinary.uploader.destroy(
          member.profileImagePublicId
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
            folder: "WLC/Team/Profile",
          }
        );

      member.profileImage =
        uploadedProfile.secure_url;

      member.profileImagePublicId =
        uploadedProfile.public_id;
    }

    // Flag Image Update
    if (req.files?.flagImage) {
      if (member.flagImagePublicId) {
        await cloudinary.uploader.destroy(
          member.flagImagePublicId
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
            folder: "WLC/Team/Flags",
          }
        );

      member.flagImage =
        uploadedFlag.secure_url;

      member.flagImagePublicId =
        uploadedFlag.public_id;
    }

    member.name =
      req.body.name || member.name;

    member.country =
      req.body.country ||
      member.country;

    member.designation =
      req.body.designation ||
      member.designation;

    member.description =
      req.body.description ||
      member.description;

    await member.save();

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TEAM MEMBER
exports.deleteTeamMember = async (
  req,
  res
) => {
  try {
    const member = await Team.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    if (member.profileImagePublicId) {
      await cloudinary.uploader.destroy(
        member.profileImagePublicId
      );
    }

    if (member.flagImagePublicId) {
      await cloudinary.uploader.destroy(
        member.flagImagePublicId
      );
    }

    await Team.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Team member deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};