const Expense = require("../models/Expense");
const TripMember = require("../models/TripMember");
const User = require("../models/User");

// ==========================================
// CALCULATE EXPENSE BALANCES
// ==========================================

const calculateBalances = (expenses) => {

    const balances = {};

    for (const expense of expenses) {

        const payerId = expense.paidBy.toString();

        // Payer paid the full expense
        balances[payerId] =
            (balances[payerId] || 0) +
            Number(expense.amount);

        // Participants owe their share
        for (const participant of expense.participants) {

            const userId =
                participant.user.toString();

            balances[userId] =
                (balances[userId] || 0) -
                Number(participant.amount);
        }
    }

    // Round to 2 decimal places
    Object.keys(balances).forEach(userId => {

        balances[userId] =
            Number(balances[userId].toFixed(2));

    });

    return balances;
};
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

        const { tripId } = req.params;

        // ==============================
        // BASIC VALIDATION
        // ==============================

        if (!title || !amount || !paidBy) {
            return res.status(400).json({
                message: "Title, amount and paidBy are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }


        // ==============================
        // CHECK CURRENT USER IS MEMBER
        // ==============================

        const currentUserMember = await TripMember.findOne({
            trip: tripId,
            user: req.user
        });

        if (!currentUserMember) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }


        // ==============================
        // CHECK PAID BY USER IS MEMBER
        // ==============================

        const payerMember = await TripMember.findOne({
            trip: tripId,
            user: paidBy
        });

        if (!payerMember) {
            return res.status(400).json({
                message: "PaidBy user is not a member of this trip"
            });
        }


        // ==============================
        // VALIDATE PARTICIPANTS
        // ==============================

        if (!participants || participants.length === 0) {
            return res.status(400).json({
                message: "At least one participant is required"
            });
        }


        // Get all trip members
        const tripMembers = await TripMember.find({
            trip: tripId
        });

        const memberIds = tripMembers.map(member =>
            member.user.toString()
        );


        // Check every participant belongs to trip
        for (const participant of participants) {

            if (!memberIds.includes(participant.user.toString())) {

                return res.status(400).json({
                    message: `User ${participant.user} is not a member of this trip`
                });

            }
        }


        // ==============================
        // CALCULATE SPLIT
        // ==============================

        let calculatedParticipants = [];


        // --------------------------------
        // EQUAL SPLIT
        // --------------------------------

        if (splitType === "equal" || !splitType) {

            const splitAmount =
                Number(amount) / participants.length;

            calculatedParticipants = participants.map(
                participant => ({
                    user: participant.user,
                    amount: Number(splitAmount.toFixed(2))
                })
            );
        }


        // --------------------------------
        // EXACT SPLIT
        // --------------------------------

        else if (splitType === "exact") {

            const total = participants.reduce(
                (sum, participant) =>
                    sum + Number(participant.amount || 0),
                0
            );

            if (Number(total.toFixed(2)) !== Number(Number(amount).toFixed(2))) {

                return res.status(400).json({
                    message: "Exact split amounts must equal total expense amount"
                });

            }

            calculatedParticipants = participants.map(
                participant => ({
                    user: participant.user,
                    amount: Number(
                        Number(participant.amount).toFixed(2)
                    )
                })
            );
        }


        // --------------------------------
        // PERCENTAGE SPLIT
        // --------------------------------

        else if (splitType === "percentage") {

            const totalPercentage = participants.reduce(
                (sum, participant) =>
                    sum + Number(participant.percentage || 0),
                0
            );

            if (Number(totalPercentage.toFixed(2)) !== 100) {

                return res.status(400).json({
                    message: "Percentages must add up to 100"
                });
            }

            calculatedParticipants = participants.map(
                participant => {

                    const percentage =
                        Number(participant.percentage);

                    const participantAmount =
                        Number(amount) *
                        percentage /
                        100;

                    return {
                        user: participant.user,
                        percentage,
                        amount: Number(
                            participantAmount.toFixed(2)
                        )
                    };
                }
            );
        }


        // ==============================
        // CREATE EXPENSE
        // ==============================

        const expense = await Expense.create({

            trip: tripId,

            title,

            amount: Number(amount),

            category,

            paidBy,

            splitType: splitType || "equal",

            participants: calculatedParticipants,

            description

        });


        // ==============================
        // RESPONSE
        // ==============================

        const populatedExpense =
            await Expense.findById(expense._id)
                .populate(
                    "paidBy",
                    "name profilePicture"
                )
                .populate(
                    "participants.user",
                    "name profilePicture"
                );


        res.status(201).json({

            message: "Expense added successfully",

            expense: populatedExpense

        });


    } catch (error) {

        console.error(
            "Create Expense Error:",
            error
        );

        res.status(500).json({

            message: "Failed to create expense",

            error: error.message

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

// ==========================================
// GET EXPENSE BALANCES
// ==========================================

const getExpenseBalances = async (req, res) => {
    try {

        const { tripId } = req.params;

        const expenses = await Expense.find({
            trip: tripId
        });

        const balances = calculateBalances(expenses);

        res.status(200).json({
            balances
        });

    } catch (error) {

        console.error(
            "Get Expense Balances Error:",
            error
        );

        res.status(500).json({
            message: "Failed to calculate expense balances"
        });
    }
};
// ==========================================
// GET EXPENSE SETTLEMENTS
// ==========================================

// ==========================================
// GET EXPENSE SETTLEMENTS
// ==========================================

const getExpenseSettlements = async (req, res) => {
    try {

        const { tripId } = req.params;

        // Get all expenses for this trip
        const expenses = await Expense.find({
            trip: tripId
        });

        // Calculate balances using reusable function
        const balances = calculateBalances(expenses);


        // ==========================================
        // SEPARATE CREDITORS AND DEBTORS
        // ==========================================

        const creditors = [];
        const debtors = [];

        for (const userId in balances) {

            const balance = balances[userId];

            if (balance > 0) {

                creditors.push({
                    userId,
                    amount: balance
                });

            } else if (balance < 0) {

                debtors.push({
                    userId,
                    amount: Math.abs(balance)
                });

            }
        }


        // ==========================================
        // CALCULATE SETTLEMENTS
        // ==========================================

        const settlements = [];

        let i = 0;
        let j = 0;

        while (
            i < debtors.length &&
            j < creditors.length
        ) {

            const debtor = debtors[i];
            const creditor = creditors[j];

            const amount = Math.min(
                debtor.amount,
                creditor.amount
            );

            settlements.push({
                from: debtor.userId,
                to: creditor.userId,
                amount: Number(amount.toFixed(2))
            });

            debtor.amount =
                Number(
                    (debtor.amount - amount).toFixed(2)
                );

            creditor.amount =
                Number(
                    (creditor.amount - amount).toFixed(2)
                );

            if (debtor.amount === 0) {
                i++;
            }

            if (creditor.amount === 0) {
                j++;
            }
        }


        // ==========================================
        // GET USER DETAILS
        // ==========================================

        const userIds = [
            ...settlements.map(
                settlement => settlement.from
            ),
            ...settlements.map(
                settlement => settlement.to
            )
        ];

        const uniqueUserIds = [...new Set(userIds)];

        const users = await User.find({
            _id: { $in: uniqueUserIds }
        }).select("name profilePicture");

        const userMap = {};

        users.forEach(user => {
            userMap[user._id.toString()] = user;
        });


        // ==========================================
        // ADD USER DETAILS TO SETTLEMENTS
        // ==========================================

        const populatedSettlements =
            settlements.map(settlement => ({

                from: userMap[settlement.from],

                to: userMap[settlement.to],

                amount: settlement.amount

            }));


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({
            settlements: populatedSettlements
        });

    } catch (error) {

        console.error(
            "Get Expense Settlements Error:",
            error
        );

        res.status(500).json({
            message: "Failed to calculate settlements"
        });
    }
};
// ==========================================
// GET EXPENSE SUMMARY
// ==========================================

const getExpenseSummary = async (req, res) => {
    try {

        const { tripId } = req.params;

        // Get all expenses
        const expenses = await Expense.find({
            trip: tripId
        });

        // ==========================================
        // TOTAL EXPENSE
        // ==========================================

        const totalExpense = expenses.reduce(
            (total, expense) =>
                total + Number(expense.amount),
            0
        );


        // ==========================================
        // CALCULATE HOW MUCH EACH USER PAID
        // ==========================================

        const paymentMap = {};

        for (const expense of expenses) {

            const userId = expense.paidBy.toString();

            paymentMap[userId] =
                (paymentMap[userId] || 0) +
                Number(expense.amount);
        }


        // ==========================================
        // GET BALANCES
        // ==========================================

        const balances = calculateBalances(expenses);


        // ==========================================
        // GET USER DETAILS
        // ==========================================

        const allUserIds = [
            ...Object.keys(paymentMap),
            ...Object.keys(balances)
        ];

        const uniqueUserIds = [
            ...new Set(allUserIds)
        ];

        const users = await User.find({
            _id: { $in: uniqueUserIds }
        }).select("name profilePicture");

        const userMap = {};

        users.forEach(user => {
            userMap[user._id.toString()] = user;
        });


        // ==========================================
        // MEMBER PAYMENTS
        // ==========================================

        const memberPayments = Object.entries(
            paymentMap
        ).map(([userId, paid]) => ({
            user: userMap[userId],
            paid: Number(paid.toFixed(2))
        }));


        // ==========================================
        // MEMBER BALANCES
        // ==========================================

        const memberBalances = Object.entries(
            balances
        ).map(([userId, balance]) => ({

            user: userMap[userId],

            balance: Number(balance.toFixed(2)),

            status:
                balance > 0
                    ? "receive"
                    : balance < 0
                        ? "owe"
                        : "settled"

        }));


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            totalExpense:
                Number(totalExpense.toFixed(2)),

            memberPayments,

            balances: memberBalances

        });

    } catch (error) {

        console.error(
            "Get Expense Summary Error:",
            error
        );

        res.status(500).json({
            message: "Failed to get expense summary"
        });
    }
};
module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseBalances,
    getExpenseSettlements,
    getExpenseSummary
};