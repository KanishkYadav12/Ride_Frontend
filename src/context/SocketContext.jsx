import React, { createContext, useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

    const s = io(baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(s);

    // Connection event handlers
    s.on("connect", () => {
      console.log("✅ Connected to server:", s.id);
    });

    s.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
    });

    s.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from server:", reason);
    });

    s.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection");
      s.removeAllListeners();
      s.disconnect();
    };
  }, []);

  const sendMessage = (event, data) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    } else {
      console.warn("⚠️ Socket not connected. Cannot send message.");
    }
  };

  const value = { socket, sendMessage };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export default SocketProvider;
