const express = require("express");

const {
    createTrip,
    getMyTrips,
    getTrip,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");
const {
    isTripMember,
    isTripOwner
} = require("../middleware/tripMiddleware");
const router = express.Router();
router.use(protect);
router.post("/",  createTrip);

router.get("/",  getMyTrips);

router.get(
    "/:tripId",
    isTripMember,
    getTrip
);

router.put(
    "/:tripId",
    isTripOwner,
    updateTrip
);

router.delete(
    "/:tripId",
    isTripOwner,
    deleteTrip
);

module.exports = router;