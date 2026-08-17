const express = require("express");

const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
  
    createExpense
);

router.get(
    "/:tripId",
  
    getExpenses
);

router.put(
    "/:id",
 
    updateExpense
);

router.delete(
    "/:id",
   
    deleteExpense
);

module.exports = router;