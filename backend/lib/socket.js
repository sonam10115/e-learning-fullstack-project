const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { ENV } = require("./env.js");
const { socketAuthMiddleware } = require("../middleware/socket.auth.middleware.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

// we will use this function to check if the user is online or not
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  if (socket.user) {
    console.log("A user connected", socket.user.userName);
  } else {
    console.log("A user connected (unauthenticated)", socket.id);
  }

  const userId = socket.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    if (socket.user) {
      console.log("A user disconnected", socket.user.userName);
    } else {
      console.log("A user disconnected", socket.id);
    }
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

module.exports = { io, app, server, getReceiverSocketId };
