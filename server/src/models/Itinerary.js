const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            default: ""
        },

        endTime: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        estimatedCost: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);