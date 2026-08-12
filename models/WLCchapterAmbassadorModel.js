const mongoose = require("mongoose");

const chapterAmbassadorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      required: true,
    },

    profileImagePublicId: {
      type: String,
      required: true,
    },

    flagImage: {
      type: String,
      required: false,
    },

    flagImagePublicId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WLCChapterAmbassador",
  chapterAmbassadorSchema
);