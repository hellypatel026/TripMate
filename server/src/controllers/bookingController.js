const Booking = require("../models/Booking");


// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            trip: req.params.tripId,
            bookedBy: req.user
        });

        res.status(201).json({
            message: "Booking added successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });
    }
};


// GET BOOKINGS
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            trip: req.params.tripId
        })
        .populate(
            "bookedBy",
            "name email profilePicture"
        )
        .sort({ startDate: 1 });

        res.status(200).json({
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings"
        });
    }
};


// UPDATE BOOKING
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking updated",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booking"
        });
    }
};


// DELETE BOOKING
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete booking"
        });
    }
};


module.exports = {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
};