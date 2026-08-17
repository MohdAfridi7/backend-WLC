const transporter = require("../config/email");

const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email Sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Send Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;