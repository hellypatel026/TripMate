const express = require("express");

const {
    createSettlement,
    getSettlements,
    markSettlementPaid
} = require("../controllers/settlementController");
const {
    isTripMember,
    isSettlementMember
} = require("../middleware/tripMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create settlement
router.post(
    "/:tripId",
    protect,
    isTripMember,
    createSettlement
);

// Get trip settlements
router.get(
    "/:tripId",
    protect,
    isTripMember,
    getSettlements
);


// Mark settlement as paid
router.put(
    "/:id/paid",
    protect,
    isSettlementMember,
    markSettlementPaid
);


module.exports = router;