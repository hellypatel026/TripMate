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

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
  protect,
    createExpense
);

router.get(
    "/:tripId",
  protect,
    getExpenses
);
router.get(
    "/:tripId/balances",
    protect,
    getExpenseBalances
);
router.get(
    "/:tripId/settlements",
    protect,
    getExpenseSettlements
);
router.get(
    "/:tripId/summary",
    protect,
    getExpenseSummary
);
router.put(
    "/:id",
 protect,
    updateExpense
);

router.delete(
    "/:id",
   protect,
    deleteExpense
);

module.exports = router;