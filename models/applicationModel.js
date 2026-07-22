const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    resumePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);