const TripMember = require("../models/TripMember");
const Itinerary = require("../models/Itinerary");
const Booking = require("../models/Booking");
const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
// ==========================================
// CHECK TRIP MEMBER
// ==========================================

const isTripMember = async (req, res, next) => {
    try {

        const membership = await TripMember.findOne({
            trip: req.params.tripId,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        req.tripMembership = membership;

        next();

    } catch (error) {

        console.error("Trip Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};


// ==========================================
// CHECK TRIP OWNER
// ==========================================

const isTripOwner = async (req, res, next) => {
    try {

        const membership = await TripMember.findOne({
            trip: req.params.tripId,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        if (membership.role !== "owner") {
            return res.status(403).json({
                message: "Only the trip owner can perform this action"
            });
        }

        req.tripMembership = membership;

        next();

    } catch (error) {

        console.error("Owner Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};
// ==========================================
// CHECK ITINERARY MEMBER
// ==========================================

const isItineraryMember = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        const membership = await TripMember.findOne({
            trip: itinerary.trip,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        req.itinerary = itinerary;
        req.tripMembership = membership;

        next();

    } catch (error) {
        console.error("Itinerary Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};

// ==========================================
// CHECK BOOKING MEMBER
// ==========================================

const isBookingMember = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const membership = await TripMember.findOne({
            trip: booking.trip,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        req.booking = booking;
        req.tripMembership = membership;

        next();

    } catch (error) {
        console.error("Booking Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};
// ==========================================
// CHECK EXPENSE MEMBER
// ==========================================

const isExpenseMember = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const membership = await TripMember.findOne({
            trip: expense.trip,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        req.expense = expense;
        req.tripMembership = membership;

        next();

    } catch (error) {
        console.error("Expense Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};// ==========================================
// CHECK SETTLEMENT MEMBER
// ==========================================

const isSettlementMember = async (req, res, next) => {
    try {
        const settlement = await Settlement.findById(req.params.id);

        if (!settlement) {
            return res.status(404).json({
                message: "Settlement not found"
            });
        }

        const membership = await TripMember.findOne({
            trip: settlement.trip,
            user: req.user
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        req.settlement = settlement;
        req.tripMembership = membership;

        next();

    } catch (error) {
        console.error("Settlement Authorization Error:", error);

        res.status(500).json({
            message: "Authorization check failed"
        });
    }
};
module.exports = {
    isTripMember,
    isTripOwner,
    isItineraryMember,
    isBookingMember,
    isExpenseMember,
    isSettlementMember
};