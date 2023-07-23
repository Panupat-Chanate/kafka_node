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

function connectSocket() {
  return new Promise((resolve, reject) => {
    io.on("connection", function (socket) {
      resolve(socket);
    });
  });
}

io.on("connection", (socket) => {
  console.log("socket.id: " + socket.id);

  socket.emit("say-hi", { message: "Chat connected", id: socket.id });

  // socket.on("join", (room) => {
  //   console.log(`Socket ${socket.id} joining ${room}`);

  //   socket.join(room);
  // });

  socket.on("send-message", ({ key, message }) => {
    console.log(key, message);

    produce({ from: socket.id, key, message });
  });

  consume((data) => {
    socket.emit("get-message", { message: data });
  });
});

async function run() {
  console.log("run");

  const socket = await connectSocket();

  if (socket) {
    console.log("socket.id: " + socket.id);

    socket.emit("say-hi", { message: "Chat connected", id: socket.id });

    socket.on("send-message", ({ key, message }) => {
      console.log(key, message);

      produce({ from: socket.id, key, message });
    });

    consume((data) => {
      socket.emit("get-message", { message: data });
    });
  }
}

// run().catch(console.error);

server.listen(5000, () => {
  console.log("socket.io listening on *:5000");
});
