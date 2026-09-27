const express = require("express");

const {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} = require("../controllers/bookingController");
const {
    isTripMember,
    isBookingMember
} = require("../middleware/tripMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
    protect,
    isTripMember,
    createBooking
);

router.get(
    "/:tripId",
    protect,
    isTripMember,
    getBookings
);

router.put(
    "/:id",
    protect,
    isBookingMember,
    updateBooking
);

router.delete(
    "/:id",
    protect,
    isBookingMember,
    deleteBooking
);
module.exports = router;