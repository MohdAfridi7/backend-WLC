const mongoose = require("mongoose");

const summitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      
    },

    description: {
      type: String,
      required: true,
    },

    day: {
      type: Number,
      required: true,
      enum: [1, 2],
    },

    image: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model( "Summit", summitSchema );