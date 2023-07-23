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

io.on("connection", (socket) => {
  console.log("socket.id: " + socket.id);

  socket.emit("sayhi", { message: "sayhi", id: socket.id });

  socket.on("sendmessage", ({ key, message }) => {
    produce({ from: socket.id, key, message });
  });

  socket.on("joinroom", ({ key }) => {
    console.log(socket.id + " join " + key);

    socket.join(key);
    console.log(io.sockets.adapter.rooms.get(key).size);

    socket.emit("getmessage", {
      message: socket.id + " join " + key,
    });

    // consume((data) => {
    //   socket.emit("getmessage", { message: data });
    // });
  });

  socket.on("leaveroom", ({ key }) => {
    console.log(socket.id + " leave " + key);

    socket.leave(key);

    socket.emit("getmessage", { message: socket.id + " leave " + key });
  });
});

server.listen(5000, () => {
  console.log("socket.io listening on *:5000");
});
