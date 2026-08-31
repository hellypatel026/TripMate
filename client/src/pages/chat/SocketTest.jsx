   // Temporary testing IDs
    const tripId = "6a8b1e2cadf3e3e640799ff4";
    const userId = "6a8b1ebbadf3e3e640799ff6";
//tripmemberId 6a8b1ebbadf3e3e640799ff6  6a8b1c87adf3e3e640799ff3 6a8c0ef0699839db2cd61941

import { useEffect, useRef, useState } from "react";
import socket from "../../services/socket";
import "./SocketTest.css";

function SocketTest() {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);

    // Temporary testing IDs
    const tripId = "6a8b1e2cadf3e3e640799ff4";
    const userId = "6a8b1c87adf3e3e640799ff3";

    // ==========================================
    // FETCH PREVIOUS MESSAGES
    // ==========================================

    const fetchMessages = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/messages/${tripId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setMessages(data);

        } catch (error) {

            console.error(
                "Failed to fetch messages:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    };

    // ==========================================
    // SOCKET
    // ==========================================

    useEffect(() => {

        const handleConnect = () => {

            console.log("Connected:", socket.id);

            socket.emit("join", {
                userId: userId,
                tripId: tripId
            });

        };

        const handleJoined = () => {

            console.log("Joined trip");

            fetchMessages();

        };

        const handleReceiveMessage = (data) => {

            console.log("New message:", data);

            setMessages((prevMessages) => [
                ...prevMessages,
                data
            ]);

        };

        const handleError = (data) => {

            console.error(
                "Socket Error:",
                data.message
            );

        };

        socket.on("connect", handleConnect);
        socket.on("joined_trip", handleJoined);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("socket_error", handleError);

        socket.connect();

        return () => {

            socket.off("connect", handleConnect);
            socket.off("joined_trip", handleJoined);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("socket_error", handleError);

            socket.disconnect();

        };

    }, []);

    // ==========================================
    // AUTO SCROLL WHEN MESSAGE CHANGES
    // ==========================================

    useEffect(() => {

        scrollToBottom();

    }, [messages]);

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        socket.emit("send_message", {

            senderId: userId,
            tripId: tripId,
            message: message.trim()

        });

        setMessage("");

    };

    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    };

    return (

        <div className="chat-page">

            {/* ================= HEADER ================= */}

            <div className="chat-header">

                <div>

                    <h2>Trip Chat</h2>

                    <span>
                        Trip Members
                    </span>

                </div>

                <div className="online-status">

                    <span className="status-dot"></span>

                    Online

                </div>

            </div>


            {/* ================= MESSAGES ================= */}

            <div className="messages-container">

                {loading ? (

                    <div className="chat-status">
                        Loading messages...
                    </div>

                ) : messages.length === 0 ? (

                    <div className="chat-status">
                        No messages yet. Start the conversation!
                    </div>

                ) : (

                    messages.map((msg) => {

                        const isMyMessage =
                            msg.sender?._id === userId;

                        return (

                            <div
                                key={msg._id}
                                className={
                                    isMyMessage
                                        ? "message-wrapper my-message"
                                        : "message-wrapper other-message"
                                }
                            >

                                <div className="message-bubble">

                                    {!isMyMessage && (

                                        <div className="sender-name">
                                            {msg.sender?.name || "Unknown User"}
                                        </div>

                                    )}

                                    <div className="message-text">
                                        {msg.text}
                                    </div>

                                    <div className="message-time">

                                        {msg.createdAt
                                            ? new Date(
                                                msg.createdAt
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )
                                            : ""
                                        }

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}

                <div ref={messagesEndRef}></div>

            </div>


            {/* ================= INPUT ================= */}

            <div className="message-input-container">

                <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />

                <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                >
                    Send
                </button>

            </div>

        </div>

    );

}

export default SocketTest;