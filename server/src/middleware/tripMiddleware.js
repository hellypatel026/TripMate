const TripMember = require("../models/TripMember");


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


module.exports = {
    isTripMember,
    isTripOwner
};