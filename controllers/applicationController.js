const cloudinary = require("../config/cloudinary");
const Application = require("../models/applicationModel");
const sendEmail = require("../utils/sendEmail");

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
      council,
      membershipType,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    // Convert resume to Base64 for Cloudinary
    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Upload Resume to Cloudinary
    const uploadedResume = await cloudinary.uploader.upload(base64File, {
      folder: "WLC_Resume",
      resource_type: "auto",
    });

    console.log(uploadedResume);

    // Save Application in MongoDB
    const application = await Application.create({
      name,
      phone,
      email,
      organisation,
      designation,
      country,
      message,
      council,
      membershipType,
      resumeUrl: uploadedResume.secure_url,
      resumePublicId: uploadedResume.public_id,
    });

    // Send Application Email to Existing Admin Email
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Job Application - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto;">

          <h2 style="color: #1c1d20;">
            New Job Application
          </h2>

          <p>
            A new application has been submitted on the WLC website.
          </p>

          <hr />

          <h3>Applicant Details</h3>

          <table style="width: 100%; border-collapse: collapse;">

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Name</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${name || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Phone</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${phone || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Email</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${email || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Organisation</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${organisation || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Designation</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${designation || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Country</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${country || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Type of Membership</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${membershipType || "N/A"}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Council</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${council || "N/A"}
              </td>
            </tr>

          </table>

          <h3 style="margin-top: 25px;">
            Message
          </h3>

          <div style="
            padding: 15px;
            background: #f5f5f5;
            border-radius: 6px;
          ">
            ${message || "No message provided"}
          </div>

          <hr />

          <p style="color: #777;">
            This email was automatically generated from the WLC website application form.
          </p>

        </div>
      `,

      // Attach uploaded resume to email
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
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