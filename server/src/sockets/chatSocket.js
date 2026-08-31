const TripMember = require("../models/TripMember");
const Message = require("../models/Message");

const setupChatSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);
       // console.log("Logged in user:", req.user._id);

        // ==========================================
        // JOIN TRIP
        // ==========================================

        socket.on("join", async (data) => {

            try {

                const { userId, tripId } = data;

                if (!userId || !tripId) {

                    socket.emit("socket_error", {
                        message: "userId and tripId are required"
                    });

                    return;
                }


                // Check whether user is actually
                // a member of this trip

                const member = await TripMember.findOne({
                    trip: tripId,
                    user: userId
                });


                if (!member) {

                    console.log(
                        `Unauthorized user ${userId} tried to join trip ${tripId}`
                    );

                    socket.emit("socket_error", {
                        message: "You are not a member of this trip"
                    });

                    return;
                }


                // ==========================================
                // STORE AUTHENTICATED SOCKET INFORMATION
                // ==========================================

                socket.userId = userId;
                socket.tripId = tripId;


                const roomName = `trip_${tripId}`;

                socket.join(roomName);


                console.log(
                    `User ${userId} joined room ${roomName}`
                );


                socket.emit("joined_trip", {
                    message: "Successfully joined trip chat",
                    tripId
                });

            } catch (error) {

                console.error(
                    "Join socket error:",
                    error
                );

                socket.emit("socket_error", {
                    message: "Failed to join trip chat"
                });
            }
        });


        // ==========================================
        // SEND MESSAGE
        // ==========================================

socket.on("send_message", async (data) => {

    try {

        const { tripId, message } = data;

        if (!tripId || !message || !message.trim()) {
            socket.emit("socket_error", {
                message: "tripId and message are required"
            });
            return;
        }

        // Make sure this socket actually joined this trip
        if (
            socket.tripId !== tripId ||
            !socket.userId
        ) {
            socket.emit("socket_error", {
                message: "You are not connected to this trip"
            });
            return;
        }

        // Verify membership again
        const member = await TripMember.findOne({
            trip: tripId,
            user: socket.userId
        });

        if (!member) {
            socket.emit("socket_error", {
                message: "You are not a member of this trip"
            });
            return;
        }

        // Save message
        const newMessage = await Message.create({
            trip: tripId,
            sender: socket.userId,
            text: message.trim()
        });

        const populatedMessage = await Message
            .findById(newMessage._id)
            .populate("sender", "name profilePicture");

        const roomName = `trip_${tripId}`;

        io.to(roomName).emit(
            "receive_message",
            populatedMessage
        );

        console.log(
            `Message sent by ${socket.userId} in ${roomName}`
        );

    } catch (error) {

        console.error(
            "Send message socket error:",
            error
        );

        socket.emit("socket_error", {
            message: "Failed to send message"
        });
    }
});


        // ==========================================
        // DISCONNECT
        // ==========================================

        socket.on("disconnect", () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        });

    });
};


module.exports = setupChatSocket;