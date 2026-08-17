const Contact = require("../models/contactModel");
const sendEmail = require("../utils/sendEmail");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      organization,
      message,
    } = req.body;

    // Save contact in MongoDB
    const contact = await Contact.create({
      fullName,
      email,
      phone,
      country,
      organization,
      message,
    });

    // Send email to existing admin email
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto;">

          <h2 style="color: #1c1d20;">
            New Contact Form Submission
          </h2>

          <p>
            A new contact form has been submitted on the website.
          </p>

          <hr />

          <h3>Contact Details</h3>

          <table style="width: 100%; border-collapse: collapse;">
            
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <strong>Full Name</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${fullName || "N/A"}
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
                <strong>Phone</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${phone || "N/A"}
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
                <strong>Organization</strong>
              </td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                ${organization || "N/A"}
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
            This email was automatically generated from the website contact form.
          </p>

        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });

  } catch (error) {
    console.error("Contact Form Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CONTACTS
exports.getAllContacts = async (
  req,
  res
) => {
  try {
    const contacts =
      await Contact.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE CONTACT
exports.getContactById = async (
  req,
  res
) => {
  try {
    const contact =
      await Contact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CONTACT
exports.deleteContact = async (
  req,
  res
) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};