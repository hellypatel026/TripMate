const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true
        },

        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);