const express = require("express");

const {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
} = require("../controllers/itineraryController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:tripId",
   
    createItinerary
);

router.get(
    "/:tripId",
   
    getItinerary
);

router.put(
    "/:id",
   
    updateItinerary
);

router.delete(
    "/:id",
   
    deleteItinerary
);

module.exports = router;