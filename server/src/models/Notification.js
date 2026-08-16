const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },

        type: {
            type: String,
            enum: [
                "trip_update",
                "expense",
                "booking",
                "invitation",
                "message",
                "system"
            ]
        },

        message: {
            type: String,
            required: true
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