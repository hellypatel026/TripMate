const express = require("express");

const {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} = require("../controllers/bookingController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
  
    createBooking
);

router.get(
    "/:tripId",

    getBookings
);

router.put(
    "/:id",
  
    updateBooking
);

router.delete(
    "/:id",

    deleteBooking
);

module.exports = router;