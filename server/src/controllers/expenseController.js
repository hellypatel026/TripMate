const Expense = require("../models/Expense");


// ==========================================
// ADD EXPENSE
// ==========================================

const createExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            paidBy,
            splitType,
            participants,
            description
        } = req.body;

        if (!title || !amount || !paidBy) {
            return res.status(400).json({
                message: "Title, amount and paidBy are required"
            });
        }

        const expense = await Expense.create({
            trip: req.params.tripId,
            title,
            amount,
            category,
            paidBy,
            splitType,
            participants,
            description
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error("Create Expense Error:", error);

        res.status(500).json({
            message: "Failed to create expense"
        });
    }
};


// ==========================================
// GET EXPENSES
// ==========================================

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            trip: req.params.tripId
        })
        .populate("paidBy", "name profilePicture")
        .populate(
            "participants.user",
            "name profilePicture"
        )
        .sort({ createdAt: -1 });

        res.status(200).json({
            expenses
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
};


// ==========================================
// UPDATE EXPENSE
// ==========================================

const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update expense"
        });
    }
};


// ==========================================
// DELETE EXPENSE
// ==========================================

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
};


module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};