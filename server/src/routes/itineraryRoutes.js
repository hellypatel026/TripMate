const express = require("express");

const {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
} = require("../controllers/itineraryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
   protect,
    createItinerary
);

router.get(
    "/:tripId",
   protect,
    getItinerary
);

router.put(
    "/:id",
   protect,
    updateItinerary
);

router.delete(
    "/:id",
   protect,
    deleteItinerary
);

module.exports = router;