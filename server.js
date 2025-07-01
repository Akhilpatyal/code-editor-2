// import statement
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = 300;
app.use(express.json());

// create server
const server = http.createServer(app);
const io = new Server(server);

// io services
// --- when io is connected ---
io.on('connection',(socket)=>{
    console.log('a new client connected');
})

// listening
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
