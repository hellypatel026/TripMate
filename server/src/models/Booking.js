const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        type: {
            type: String,
            enum: [
                "hotel",
                "flight",
                "train",
                "bus",
                "taxi",
                "other"
            ],
            required: true
        },

        name: {
            type: String,
            required: true
        },

        bookingReference: {
            type: String,
            default: ""
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        price: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        },

        startDate: Date,

        endDate: Date,

        location: {
            type: String,
            default: ""
        },

        documentUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);