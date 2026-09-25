const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            default: null
        },

        type: {
            type: String,
            enum: [
                "trip_invite",
                "trip_update",
                "itinerary_update",
                "expense_added",
                "expense_updated",
                "chat_message",
                "gallery_upload",
                "general"
            ],
            required: true
        },

        
        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);