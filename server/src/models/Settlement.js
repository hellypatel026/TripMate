const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Settlement", settlementSchema);