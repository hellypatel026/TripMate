const Trip = require("../models/Trip");
const TripMember = require("../models/TripMember");


const createTrip = async (req, res) => {
    try {
        const {
            name,
            destination,
            description,
            startDate,
            endDate,
            budget,
            coverImage,
            createdBy
        } = req.body;

        if (!name || !destination || !startDate || !endDate) {
            return res.status(400).json({
                message: "Name, destination, start date and end date are required"
            });
        }

        const trip = await Trip.create({
            name,
            destination,
            description,
            startDate,
            endDate,
            budget,
            coverImage,
            createdBy :req.user
        });

        // Automatically make creator the owner
        await TripMember.create({
            trip: trip._id,
            user: req.user,
            role: "owner"
        });

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });

    } catch (error) {
        console.error("Create Trip Error:", error);

        res.status(500).json({
            message: "Failed to create trip",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL TRIPS OF CURRENT USER
// ==========================================

const getMyTrips = async (req, res) => {
    try {
        const memberships = await TripMember.find({
            user: req.user
        }).populate("trip");

        const trips = memberships.map((membership) => ({
            trip: membership.trip,
            role: membership.role
        }));

        res.status(200).json({
            trips
        });

    } catch (error) {
        console.error("Get Trips Error:", error);

        res.status(500).json({
            message: "Failed to fetch trips"
        });
    }
};


// ==========================================
// GET SINGLE TRIP
// ==========================================

const getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId)
            .populate("createdBy", "name email profilePicture");

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.status(200).json({
            trip
        });

    } catch (error) {
        console.error("Get Trip Error:", error);

        res.status(500).json({
            message: "Failed to fetch trip"
        });
    }
};


// ==========================================
// UPDATE TRIP
// ==========================================

const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        if (trip.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "Only trip owner can update trip"
            });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.tripId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Trip updated successfully",
            trip: updatedTrip
        });

    } catch (error) {
        console.error("Update Trip Error:", error);

        res.status(500).json({
            message: "Failed to update trip"
        });
    }
};


// ==========================================
// DELETE TRIP
// ==========================================

const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        if (trip.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "Only trip owner can delete trip"
            });
        }

        await Trip.findByIdAndDelete(req.params.tripId);

        await TripMember.deleteMany({
            trip: req.params.tripId
        });

        res.status(200).json({
            message: "Trip deleted successfully"
        });

    } catch (error) {
        console.error("Delete Trip Error:", error);

        res.status(500).json({
            message: "Failed to delete trip"
        });
    }
};


module.exports = {
    createTrip,
    getMyTrips,
    getTrip,
    updateTrip,
    deleteTrip
};