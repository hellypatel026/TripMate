const express = require("express");

const {
    createSettlement,
    getSettlements,
    markSettlementPaid
} = require("../controllers/settlementController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create settlement
router.post(
    "/:tripId",
    protect,
    createSettlement
);


// Get trip settlements
router.get(
    "/:tripId",
    protect,
    getSettlements
);


// Mark settlement as paid
router.put(
    "/:id/paid",
    protect,
    markSettlementPaid
);


module.exports = router;