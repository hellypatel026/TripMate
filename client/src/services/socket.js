import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    withCredentials: true,
    autoConnect: false,
    transports: ["polling", "websocket"]
});

export default socket;