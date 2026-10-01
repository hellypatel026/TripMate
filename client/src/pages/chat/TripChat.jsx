// import { useEffect, useState, useRef } from "react";
// import api from "../../services/api";
// import socket from "../../services/socket";
// import useAuthStore from "../../store/authStore";
// function TripChat({ tripId }) {
//   const messagesEndRef = useRef(null);
//   const { user } = useAuthStore();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//   loadMessages();

//   if (!user?._id) {
//     return;
//   }

  
//   socket.auth = {
//     userId: user._id,
//   };

//   socket.connect();

//   socket.on("connect", () => {
    
//     socket.emit("join", {
//       tripId,
//     });
//   });

//   socket.on("receive_message", (message) => {

//     setMessages((prev) => [...prev, message]);
//   });

//   socket.on("socket_error", (error) => {
//     console.log(error.message);
//   });

//   socket.on("connect_error", (error) => {
//     console.log( error.message);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log( reason);
//   });

//   return () => {
//     socket.off("connect");
//     socket.off("receive_message");
//     socket.off("socket_error");
//     socket.off("connect_error");
//     socket.off("disconnect");
//     socket.disconnect();
//   };
// }, [tripId, user]);
// useEffect(() => {
//   messagesEndRef.current?.scrollIntoView({
//     behavior: "smooth"
//   });
// }, [messages]);

//   const loadMessages = async () => {
//     const res = await api.get(`/messages/${tripId}`);
//     setMessages(res.data);
//   };

//   const sendMessage = () => {
//   if (!text.trim()) return;

//   if (!socket.connected) {
//     alert("Chat connection is not ready. Please refresh the page.");
//     return;
//   }

//   socket.emit("send_message", {
//   tripId,
//   message: text.trim(),
// });

  

//   setText("");
// };

//   return (
//     <div>
//       <h2>Trip Chat</h2>

//       {messages.map((msg) => {
//   const isMine = msg.sender?._id === user?._id;

//   return (
//     <div
//       key={msg._id}
//       style={{
//         display: "flex",
//         justifyContent: isMine ? "flex-end" : "flex-start",
//         marginBottom: "10px",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "70%",
//           padding: "10px 14px",
//           borderRadius: "12px",
//           backgroundColor: isMine ? "#dcf8c6" : "#f1f1f1",
//         }}
//       >
//         {!isMine && (
//           <strong>
//             {msg.sender?.name || "Unknown"}
//           </strong>
//         )}

//         <p
//   style={{
//     margin: "5px 0 0",
//   }}
// >
//   {msg.text}
// </p>

// <small
//   style={{
//     display: "block",
//     marginTop: "4px",
//     fontSize: "11px",
//     opacity: 0.6,
//     textAlign: "right",
//   }}
// >
//   {msg.createdAt
//     ? new Date(msg.createdAt).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : ""}
// </small>
//       </div>
//     </div>
//   );
// })}

// <div ref={messagesEndRef} />
//       <div ref={messagesEndRef} />

//       <input
//   value={text}
//   onChange={(e) => setText(e.target.value)}
//   onKeyDown={(e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   }}
//   placeholder="Type a message..."
// />

//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default TripChat;

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./TripChat.css";

function TripChat({ tripId }) {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const { user } = useAuthStore();
    const logout = useAuthStore((state) => state.logout);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const loadChat = async () => {
            try {
                setIsLoading(true);

                const [tripResponse, messageResponse] = await Promise.all([
                    api.get(`/trips/${tripId}`),
                    api.get(`/messages/${tripId}`)
                ]);

                setTrip(tripResponse.data.trip);
                setMessages(messageResponse.data);
            } catch (error) {
                console.error("Failed to load chat:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChat();
    }, [tripId]);

    useEffect(() => {
        if (!user?._id) return;

        socket.auth = {
            userId: user._id
        };

        const handleConnect = () => {
            setIsConnected(true);

            socket.emit("join", {
                tripId
            });
        };

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        const handleSocketError = (error) => {
            console.error("Socket error:", error?.message);
        };

        const handleConnectError = (error) => {
            console.error("Socket connection error:", error?.message);
            setIsConnected(false);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        socket.on("connect", handleConnect);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("socket_error", handleSocketError);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("socket_error", handleSocketError);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);

            socket.disconnect();
        };
    }, [tripId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const handleSendMessage = () => {
        if (!text.trim()) return;

        if (!socket.connected) {
            alert("Chat connection is not ready. Please refresh the page.");
            return;
        }

        socket.emit("send_message", {
            tripId,
            message: text.trim()
        });

        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="chat-page-wrapper">
            <TravelBackground />

            <header className="chat-navbar">
                <Link to="/" className="chat-brand">
                    <span className="chat-brand-icon">✈</span>
                    <span>TripMate</span>
                </Link>

                <nav className="chat-nav">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/profile">Profile</Link>

                    <button
                        className="chat-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="chat-main">
                <Link
                    to={`/trips/${tripId}`}
                    className="chat-back-link"
                >
                    ← Back to Trip
                </Link>

                <section className="chat-card">
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <div className="chat-title-icon">
                                💬
                            </div>

                            <div>
                                <p className="chat-eyebrow">
                                    TRAVEL GROUP
                                </p>

                                <h1>
                                    {trip?.name || "Trip Chat"}
                                </h1>

                                <p className="chat-subtitle">
                                    {trip?.destination
                                        ? `Chat about your trip to ${trip.destination}`
                                        : "Stay connected with your travel group"}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`chat-connection-status ${
                                isConnected
                                    ? "connected"
                                    : "disconnected"
                            }`}
                        >
                            <span className="chat-status-dot"></span>

                            {isConnected
                                ? "Connected"
                                : "Connecting..."}
                        </div>
                    </div>

                    <div className="chat-messages">
                        {isLoading ? (
                            <div className="chat-empty-state">
                                <div className="chat-empty-icon">✈</div>

                                <h2>Loading conversation...</h2>

                                <p>
                                    Getting your travel group's messages ready.
                                </p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="chat-empty-state">
                                <div className="chat-empty-icon">💬</div>

                                <h2>Start the conversation</h2>

                                <p>
                                    No messages yet. Send the first message
                                    to your travel group.
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMine =
                                    msg.sender?._id === user?._id;

                                return (
                                    <div
                                        key={msg._id}
                                        className={`message-row ${
                                            isMine
                                                ? "message-row-mine"
                                                : "message-row-other"
                                        }`}
                                    >
                                        <div
                                            className={`message-bubble ${
                                                isMine
                                                    ? "message-bubble-mine"
                                                    : "message-bubble-other"
                                            }`}
                                        >
                                            {!isMine && (
                                                <div className="message-sender">
                                                    {msg.sender?.name ||
                                                        "Unknown User"}
                                                </div>
                                            )}

                                            <div className="message-content">
                                                {msg.text}
                                            </div>

                                            <div className="message-time">
                                                {formatTime(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) =>
                                    setText(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Write a message..."
                                aria-label="Write a message"
                            />

                            <button
                                type="button"
                                className="chat-send-button"
                                onClick={handleSendMessage}
                                disabled={!text.trim()}
                            >
                                <span>Send</span>
                                <span>→</span>
                            </button>
                        </div>

                        <p className="chat-input-hint">
                            Press Enter to send
                        </p>
                    </div>
                </section>
            </main>

            <footer className="chat-footer">
                <span>TripMate</span>
                <p>Plan less. Travel more.</p>
            </footer>
        </div>
    );
}

export default TripChat;