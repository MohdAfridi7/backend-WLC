const mongoose = require("mongoose");

const gfetscSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
      required: true,
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

module.exports = mongoose.model("gfetsc", gfetscSchema);