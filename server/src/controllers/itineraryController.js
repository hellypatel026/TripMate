const Itinerary = require("../models/Itinerary");


// CREATE
const createItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.create({
            ...req.body,
            trip: req.params.tripId,
            createdBy: req.user
        });

        res.status(201).json({
            message: "Itinerary activity created",
            itinerary
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create itinerary",
            error: error.message
        });
    }
};


// GET
const getItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.find({
            trip: req.params.tripId
        })
        .sort({ date: 1, startTime: 1 })
        .populate("createdBy", "name profilePicture");

        res.status(200).json({
            itinerary
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch itinerary"
        });
    }
};


// UPDATE
const updateItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        res.status(200).json({
            message: "Itinerary updated",
            itinerary
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update itinerary"
        });
    }
};


// DELETE
const deleteItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findByIdAndDelete(
            req.params.id
        );

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        res.status(200).json({
            message: "Itinerary deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete itinerary"
        });
    }
};


module.exports = {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
};