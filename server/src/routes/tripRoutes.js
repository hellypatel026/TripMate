const express = require("express");

const {
    createTrip,
    getMyTrips,
    getTrip,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);
router.post("/",  createTrip);

router.get("/",  getMyTrips);

router.get("/:tripId",  getTrip);

router.put("/:tripId",  updateTrip);

router.delete("/:tripId",  deleteTrip);

module.exports = router;