const express = require("express");

const {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
} = require("../controllers/itineraryController");
const {
    isTripMember,
    isItineraryMember
} = require("../middleware/tripMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
    protect,
    isTripMember,
    createItinerary
);
router.get(
    "/:tripId",
    protect,
    isTripMember,
    getItinerary
);

router.put(
    "/:id",
    protect,
    isItineraryMember,
    updateItinerary
);
router.delete(
    "/:id",
    protect,
    isItineraryMember,
    deleteItinerary
);

module.exports = router;