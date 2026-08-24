const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mediaUrl: {
            type: String,
            required: true
        },

        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true
        },

        caption: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Gallery", gallerySchema);