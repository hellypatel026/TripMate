const Settlement = require("../models/Settlement");
const TripMember = require("../models/TripMember");


// ==========================================
// CREATE SETTLEMENT
// ==========================================

const createSettlement = async (req, res) => {
    try {

        const { tripId } = req.params;

        const {
            from,
            to,
            amount
        } = req.body;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!from || !to || !amount) {
            return res.status(400).json({
                message: "from, to and amount are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        if (from === to) {
            return res.status(400).json({
                message: "from and to users cannot be the same"
            });
        }


        // ==========================================
        // CHECK CURRENT USER IS TRIP MEMBER
        // ==========================================

        const currentMember = await TripMember.findOne({
            trip: tripId,
            user: req.user
        });

        if (!currentMember) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }


        // ==========================================
        // CHECK FROM USER IS MEMBER
        // ==========================================

        const fromMember = await TripMember.findOne({
            trip: tripId,
            user: from
        });

        if (!fromMember) {
            return res.status(400).json({
                message: "From user is not a member of this trip"
            });
        }


        // ==========================================
        // CHECK TO USER IS MEMBER
        // ==========================================

        const toMember = await TripMember.findOne({
            trip: tripId,
            user: to
        });

        if (!toMember) {
            return res.status(400).json({
                message: "To user is not a member of this trip"
            });
        }


        // ==========================================
        // CREATE SETTLEMENT
        // ==========================================

        const settlement = await Settlement.create({
            trip: tripId,
            from,
            to,
            amount: Number(amount.toFixed(2))
        });


        const populatedSettlement =
            await Settlement.findById(settlement._id)
                .populate("from", "name profilePicture")
                .populate("to", "name profilePicture");


        res.status(201).json({
            message: "Settlement created successfully",
            settlement: populatedSettlement
        });

    } catch (error) {

        console.error(
            "Create Settlement Error:",
            error
        );

        res.status(500).json({
            message: "Failed to create settlement"
        });
    }
};


// ==========================================
// GET SETTLEMENTS
// ==========================================

const getSettlements = async (req, res) => {
    try {

        const { tripId } = req.params;

        const settlements = await Settlement.find({
            trip: tripId
        })
            .populate("from", "name profilePicture")
            .populate("to", "name profilePicture")
            .sort({ createdAt: -1 });


        res.status(200).json({
            settlements
        });

    } catch (error) {

        console.error(
            "Get Settlements Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch settlements"
        });
    }
};


// ==========================================
// MARK SETTLEMENT AS PAID
// ==========================================

const markSettlementPaid = async (req, res) => {
    try {

        const { id } = req.params;

        const settlement =
            await Settlement.findById(id);

        if (!settlement) {
            return res.status(404).json({
                message: "Settlement not found"
            });
        }


        // Only the person who owes the money
        // can mark it as paid
        if (
            settlement.from.toString() !==
            req.user.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the person who owes the money can mark this settlement as paid"
            });
        }


        if (settlement.status === "paid") {
            return res.status(400).json({
                message: "Settlement is already paid"
            });
        }


        settlement.status = "paid";
        settlement.paidAt = new Date();

        await settlement.save();


        const populatedSettlement =
            await Settlement.findById(settlement._id)
                .populate("from", "name profilePicture")
                .populate("to", "name profilePicture");


        res.status(200).json({
            message: "Settlement marked as paid",
            settlement: populatedSettlement
        });

    } catch (error) {

        console.error(
            "Mark Settlement Paid Error:",
            error
        );

        res.status(500).json({
            message: "Failed to mark settlement as paid"
        });
    }
};


module.exports = {
    createSettlement,
    getSettlements,
    markSettlementPaid
};