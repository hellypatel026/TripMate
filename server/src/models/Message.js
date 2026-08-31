const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "location"],
      default: "text",
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);