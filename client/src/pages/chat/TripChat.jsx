import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";

function TripChat({ tripId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();

    socket.connect();

    socket.emit("join-trip", tripId);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [tripId]);

  const loadMessages = async () => {
    const res = await api.get(`/messages/${tripId}`);
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      tripId,
      text,
    });

    setText("");
  };

  return (
    <div>
      <h2>Trip Chat</h2>

      {messages.map((msg) => (
        <div key={msg._id}>
          <strong>{msg.sender.name}</strong>
          <p>{msg.text}</p>
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default TripChat;