const express = require("express");

const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseBalances,
    getExpenseSettlements,
    getExpenseSummary
} = require("../controllers/expenseController");
const {
    isTripMember,
    isExpenseMember
} = require("../middleware/tripMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
    protect,
    isTripMember,
    createExpense
);

router.get(
    "/:tripId",
    protect,
    isTripMember,
    getExpenses
);

router.get(
    "/:tripId/balances",
    protect,
    isTripMember,
    getExpenseBalances
);

router.get(
    "/:tripId/settlements",
    protect,
    isTripMember,
    getExpenseSettlements
);

router.get(
    "/:tripId/summary",
    protect,
    isTripMember,
    getExpenseSummary
);
router.put(
    "/:id",
    protect,
    isExpenseMember,
    updateExpense
);

router.delete(
    "/:id",
    protect,
    isExpenseMember,
    deleteExpense
);

module.exports = router;