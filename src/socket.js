import { io } from "socket.io-client";

export const initSocket = async () => {
  const BACKEND_URL = process.env.REACT_BACKEND_URL || "http://localhost:5000";

  const options = {
    "force new connection": true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  try {
    const socket = io(BACKEND_URL, options);
    return socket;
  } catch (error) {
    console.error("Socket connection failed:", error);
    throw error;
  }
};
