const Message = require("../models/Message");


// GET CHAT HISTORY

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            trip: req.params.tripId
        })
        .populate(
            "sender",
            "name profilePicture"
        )
        .sort({ createdAt: 1 });

        res.status(200).json({
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
};


// CREATE MESSAGE

const createMessage = async (req, res) => {
    try {
        const {
            message,
            messageType
        } = req.body;

        const newMessage = await Message.create({
            trip: req.params.tripId,
            sender: req.user,
            message,
            messageType
        });

        const populatedMessage =
            await newMessage.populate(
                "sender",
                "name profilePicture"
            );

        res.status(201).json({
            message: populatedMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to send message"
        });
    }
};


module.exports = {
    getMessages,
    createMessage
};