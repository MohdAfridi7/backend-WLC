const cloudinary = require("../config/cloudinary");
const Application = require("../models/applicationModel");

// Submit Application
exports.submitApplication = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      organisation,
      designation,
      country,
      message,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

 const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
  "base64"
)}`;

const uploadedResume = await cloudinary.uploader.upload(base64File, {
  folder: "WLC_Resume",
  resource_type: "auto",
});

console.log(uploadedResume);

    const application = await Application.create({
      name,
      phone,
      email,
      organisation,
      designation,
      country,
      message,
      resumeUrl: uploadedResume.secure_url,
      resumePublicId: uploadedResume.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Submit Application Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get Application Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete Resume from Cloudinary
    if (application.resumePublicId) {
      await cloudinary.uploader.destroy(
        application.resumePublicId,
        {
          resource_type: "raw",
        }
      );
    }

    await Application.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Application Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

