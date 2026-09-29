import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import useAuthStore from "../../store/authStore";
function TripChat({ tripId }) {
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
  loadMessages();

  if (!user?._id) {
    return;
  }

  
  socket.auth = {
    userId: user._id,
  };

  socket.connect();

  socket.on("connect", () => {
    
    socket.emit("join", {
      tripId,
    });
  });

  socket.on("receive_message", (message) => {

    setMessages((prev) => [...prev, message]);
  });

  socket.on("socket_error", (error) => {
    console.log(error.message);
  });

  socket.on("connect_error", (error) => {
    console.log( error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log( reason);
  });

  return () => {
    socket.off("connect");
    socket.off("receive_message");
    socket.off("socket_error");
    socket.off("connect_error");
    socket.off("disconnect");
    socket.disconnect();
  };
}, [tripId, user]);
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages]);

  const loadMessages = async () => {
    const res = await api.get(`/messages/${tripId}`);
    setMessages(res.data);
  };

  const sendMessage = () => {
  if (!text.trim()) return;

  if (!socket.connected) {
    alert("Chat connection is not ready. Please refresh the page.");
    return;
  }

  socket.emit("send_message", {
  tripId,
  message: text.trim(),
});

  

  setText("");
};

  return (
    <div>
      <h2>Trip Chat</h2>

      {messages.map((msg) => {
  const isMine = msg.sender?._id === user?._id;

  return (
    <div
      key={msg._id}
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "12px",
          backgroundColor: isMine ? "#dcf8c6" : "#f1f1f1",
        }}
      >
        {!isMine && (
          <strong>
            {msg.sender?.name || "Unknown"}
          </strong>
        )}

        <p
  style={{
    margin: "5px 0 0",
  }}
>
  {msg.text}
</p>

<small
  style={{
    display: "block",
    marginTop: "4px",
    fontSize: "11px",
    opacity: 0.6,
    textAlign: "right",
  }}
>
  {msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""}
</small>
      </div>
    </div>
  );
})}

<div ref={messagesEndRef} />
      <div ref={messagesEndRef} />

      <input
  value={text}
  onChange={(e) => setText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  placeholder="Type a message..."
/>

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default TripChat;