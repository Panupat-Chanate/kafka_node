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
//   io.sockets.emit("get-message", { message: msg });
});

io.on("connection", function (socket) {
  socket.emit("say-hi", { message: "Chat connected", id: socket.id });
  socket.emit("get-message", { message: 'msg' });
  socket.on("send-message", ({ key, message }) => {
    produce({ from: socket.id, key, message });
  });
});

io.listen(5000, () => {
  console.log("socket.io listening on *:5000");
});
