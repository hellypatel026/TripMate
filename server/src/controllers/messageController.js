// const Message = require("../models/Message");
// const TripMember = require("../models/TripMember");

// const getTripMessages = async (req, res) => {
//     try {
//         const { tripId } = req.params;

//         console.log("Logged in user:", req.user._id);
//         console.log("Trip ID:", tripId);

//         const userId = req.user._id;

//         const member = await TripMember.findOne({
//             trip: tripId,
//             user: userId
//         });

//         console.log("Membership:", member);

//         if (!member) {
//             return res.status(403).json({
//                 message: "You are not a member of this trip"
//             });
//         }

//         const messages = await Message.find({
//             trip: tripId
//         })
//         .populate("sender", "name profilePicture")
//         .sort({ createdAt: 1 });

//         res.status(200).json(messages);

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Failed to fetch messages",
//             error: error.message
//         });
//     }
// };
// module.exports = {
//     getTripMessages
// };


const Message = require("../models/Message");
const TripMember = require("../models/TripMember");

const getTripMessages = async (req, res) => {
    try {

        const { tripId } = req.params;

        // Your authMiddleware may store req.user either
        // as an object or directly as the user ID.
        const userId = req.user?._id || req.user;

        console.log("==============================");
        console.log("GET TRIP MESSAGES");
        console.log("Trip ID:", tripId);
        console.log("User ID:", userId);
        console.log("req.user:", req.user);

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Check membership
        const member = await TripMember.findOne({
            trip: tripId,
            user: userId
        });

        console.log("Membership:", member);

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this trip"
            });
        }

        // Fetch messages
        const messages = await Message.find({
            trip: tripId
        })
            .populate("sender", "name profilePicture")
            .sort({ createdAt: 1 });

        console.log("Messages found:", messages.length);

        return res.status(200).json(messages);

    } catch (error) {

        console.error("GET MESSAGES ERROR:");
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};

module.exports = {
    getTripMessages
};