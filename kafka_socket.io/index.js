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
    console.log(socket.id + " send to " + key);

    // produce({ from: socket.id, key, message });

    io.sockets.in(key).emit("getmessage", {
      message: message.value,
    });
    // socket.in(key).emit("getmessage", {
    //   message: message.value,
    // });
    // socket.to(socket.id).to(key).emit("getmessage", {
    //   message: message.value,
    // });
  });

  socket.on("joinroom", ({ key }) => {
    console.log(socket.id + " join " + key);

    socket.join(key);

    socket.emit("getmessage", {
      message:
        socket.id +
        " join " +
        key +
        " number of room " +
        io.sockets.adapter.rooms.get(key).size,
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
