// import statement
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { Actions } = require("./src/Actions");
const PORT = process.env.port || 5000;
app.use(express.json());

// create server
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

// functions
function getAllConnectedClients(roomId) {
  // stored in array and return an array
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
// io services
// --- when io is connected ---
io.on("connection", (socket) => {
  console.log("A new client connected:", socket.id);
  // action tirger from frontend
  socket.on(Actions.JOIN, ({ roomId, username }) => {
    // user id and socket id relationship
    userSocketMap[socket.id] = username;
    // join use in room
    socket.join(roomId);

    // getting list of user who are in the room
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Actions.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
    console.log("Client disconnected:", socket.id);
  });
});

// listening
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
