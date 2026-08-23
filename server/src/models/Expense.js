const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            enum: [
                "food",
                "hotel",
                "Accommodation",
                "transport",
                "shopping",
                "activity",
                "other"
            ],
            default: "other"
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        splitType: {
            type: String,
            enum: ["equal", "exact", "percentage"],
            default: "equal"
        },

        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                amount: Number,

                percentage: Number
            }
        ],

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);