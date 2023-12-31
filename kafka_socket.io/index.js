const consumer = require("./consumer.js");
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

  socket.on("sendmessage", ({ topic, key, message }, callback) => {
    console.log(socket.id + " send to " + key);

    produce({ from: socket.id, topic, key, message });

    callback({
      ok: true,
    });
  });

  socket.on("joinroom", ({ topic, key }) => {
    // console.log(socket.id + " join " + key);

    socket.join(key);

    socket.emit("getmessage", {
      message:
        socket.id +
        " join " +
        key +
        " number of room " +
        io.sockets.adapter.rooms.get(key).size,
    });

    consumer.onConsume({ topic }, (data) => {
      if (key === data.key) {
        io.sockets.in(key).emit("getmessage", {
          message: data,
        });
      }
    });
  });

  socket.on("leaveroom", ({ key }) => {
    // console.log(socket.id + " leave " + key);

    socket.leave(key);

    socket.emit("getmessage", { message: socket.id + " leave " + key });

    consumer.closeConsume({ topic: true }, (message) => {
      console.log("kafka close " + message);
    });
  });
});

server.listen(process.argv[2], () => {
  console.log("socket.io listening on *:" + process.argv[2]);
});

// note
// socket.in(key).emit
// socket.to(socket.id).to(key).emit
// io.sockets.in(key).emit("getmessage", {
//   message: message.value,
// });
// socket.emit("getmessage", { message: data });
