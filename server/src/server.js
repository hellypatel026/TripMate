const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const tripMemberRoutes = require("./routes/tripMemberRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const setupChatSocket = require("./sockets/chatSocket");
dotenv.config();

const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
       
        credentials: true
    }
});
setupChatSocket(io);


app.use(
    cors({
        origin: process.env.CLIENT_URL,
        
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "TripMate API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip-members", tripMemberRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/gallery",galleryRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();