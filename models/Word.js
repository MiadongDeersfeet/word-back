const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    koreanMeaning: {
      type: String,
      required: true,
      trim: true,
    },
    foreignMeaning: {
      type: String,
      required: true,
      trim: true,
    },
    isLearned: {
      type: Boolean,
      default: false,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      default: "기타",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Word", wordSchema);
