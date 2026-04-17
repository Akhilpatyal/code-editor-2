import { io } from "socket.io-client";

export const initSocket = async () => {
  // CRA only inlines env vars prefixed with REACT_APP_
  const BACKEND_URL =
    process.env.REACT_APP_SOCKET_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "http://localhost:5000";

  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  const socket = io(BACKEND_URL, options);
  return socket;
};
