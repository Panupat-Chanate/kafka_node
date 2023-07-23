const kafka = require("kafka-node");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const Consumer = kafka.Consumer,
  client = new kafka.KafkaClient({
    idleConnection: 24 * 60 * 60 * 1000,
    kafkaHost: "localhost:9092",
  }),
  consumer = new Consumer(
    client,
    [{ topic: "kafka-panu-topic", partition: 0 }],
    {
      autoCommit: false,
    }
  );

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

// io.on("connection", (client) => {
//   console.log("Connected", client);

//   consumer.on("message", function (message) {
//     console.log(message);
//     // io.sockets.in(key).emit("getmessage", {
//     //   message: data,
//     // });
//   });
//   client.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

server.listen(5000, () => {
  console.log("socket.io listening on *:5000");
});
