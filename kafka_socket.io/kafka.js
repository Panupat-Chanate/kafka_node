const kafka = require("kafka-node");
const express = require("express");
const port = 5000;
const app = express();

const Consumer = kafka.Consumer,
  client = new kafka.KafkaClient("localhost:9092"),
  consumer = new Consumer(
    client,
    [{ topic: "kafka-panu-topic", partition: 0 }],
    {
      autoCommit: false,
    }
  );

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (client) => {
  console.log("Connected", client);
  consumer.on("message", function (message) {
    console.log(message);
    // io.sockets.in(key).emit("getmessage", {
    //   message: data,
    // });
  });
  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
