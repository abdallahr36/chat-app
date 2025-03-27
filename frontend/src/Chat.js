import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const Chat = ({ onLogout }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("Unknown");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "Unknown");
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    const newSocket = io("http://localhost:5050", {
      auth: { token }
    });

    newSocket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    newSocket.on("chat message", (msg) => {
      console.log("📥 Message from server:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("chat history", (history) => {
      setMessages(history);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", {
        username,
        text: message
      });
      setMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (socket) socket.disconnect();
    onLogout();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Chat Room </h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px"
          }}
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSend}>
        <input
          style={{ width: "80%", padding: "0.5rem" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button style={{ padding: "0.5rem" }} type="submit">
          Send
        </button>
      </form>

      <ul>
        {messages.map((msg, i) => (
          <li key={i} style={{ marginTop: "1rem" }}>
            <strong>{msg.username}</strong>: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
