const TripMember = require("../models/TripMember");
const Trip = require("../models/Trip");
const User = require("../models/User");



const addMember = async (req, res) => {
    try {
        const { email, role } = req.body;

        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }
        // console.log("req.user:", req.user);
        // console.log("trip.createdBy:", trip.createdBy);

        if (trip.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "Only trip owner can add members"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingMember = await TripMember.findOne({
            trip: req.params.tripId,
            user: user._id
        });

        if (existingMember) {
            return res.status(400).json({
                message: "User is already a member"
            });
        }

        const member = await TripMember.create({
            trip: req.params.tripId,
            user: user._id,
            role: role || "member"
        });

        res.status(201).json({
            message: "Member added successfully",
            member
        });

    // } catch (error) {
    //     console.error("Add Member Error:", error);

    //     res.status(500).json({
    //         message: "Failed to add member"
    //     });
    // }
    } catch (error) {
    console.error("Add Member Error:", error);

    res.status(500).json({
        message: "Failed to add member",
        error: error.message
    });
}
};


// ==========================================
// GET MEMBERS
// ==========================================

const getMembers = async (req, res) => {
    try {
        const members = await TripMember.find({
            trip: req.params.tripId
        }).populate(
            "user",
            "name email profilePicture"
        );

        res.status(200).json({
            members
        });

    } catch (error) {
        console.error("Get Members Error:", error);

        res.status(500).json({
            message: "Failed to fetch members"
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        if (trip.createdBy.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: "Only trip owner can remove members"
            });
        }

        const member = await TripMember.findOne({
            trip: req.params.tripId,
            user: req.params.userId
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        if (member.role === "owner") {
            return res.status(400).json({
                message: "Trip owner cannot be removed"
            });
        }

        await TripMember.findByIdAndDelete(member._id);

        res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (error) {
        console.error("Remove Member Error:", error);

        res.status(500).json({
            message: "Failed to remove member"
        });
    }
};


module.exports = {
    addMember,
    getMembers,
    removeMember
};