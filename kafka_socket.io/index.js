const consume = require("./consumer.js");
const produce = require("./producer.js");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

consume((msg) => {
  console.log(msg);
  //   io.sockets.emit("new-message", { from, to, message });
});

io.on("connection", function (socket) {
  socket.emit("say-hi", { message: "Chat connected", id: socket.id });

  socket.on("send-message", ({ message, to }) => {
    produce({ from: socket.id, to, message });
  });
});
