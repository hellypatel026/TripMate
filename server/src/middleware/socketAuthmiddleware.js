const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.userId = decoded.userId;

        next();

    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Invalid or expired token"));
    }
};

module.exports = socketAuthMiddleware;