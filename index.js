const kafka = require("kafka-node");
const config = require("./config");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
var bodyParser = require("body-parser");
const cors = require("cors");

var CONSUMER_RUNNING = true;

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: config.KafkaHost });
const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket.io connected");

  socket.on("disconnect", () => {
    console.log("socket.io disconnected");

    CONSUMER_RUNNING = true;
  });
});

app.post("/producer", async (req, res) => {
  try {
    let payload = [
      {
        topic: req.body.body.topic,
        key: req.body.body.key,
        messages: JSON.stringify(req.body.body.value),
      },
    ];

    producer.send(payload, (error, data) => {
      console.log("data: ", data);

      if (!error) {
        res.json({ ok: true, message: data });
      } else {
        res.json({ ok: false, message: error });
      }
    });

    producer.on("error", function (error) {
      res.json({ ok: false, message: error });
    });
  } catch (error) {
    res.json({ ok: false, message: error });
  }
});

app.post("/consumer", async (req, res) => {
  try {
    if (CONSUMER_RUNNING) {
      const Consumer = kafka.Consumer;
      const client = new kafka.KafkaClient({
        idleConnection: 24 * 60 * 60 * 1000,
        kafkaHost: config.KafkaHost,
      });

      let consumer = new Consumer(
        client,
        [{ topic: req.body.body.topic, partition: 0 }],
        {
          autoCommit: true,
          fetchMaxWaitMs: 1000,
          fetchMaxBytes: 1024 * 1024,
          encoding: "utf8",
          fromOffset: true,
        }
      );
      consumer.on("message", async function (message) {
        console.log("data: ", message);

        if (message.key === res.body.body.key) io.emit("consumer", message);
      });
      consumer.on("error", function (error) {
        console.log("error", error);
      });

      CONSUMER_RUNNING = false;
    }
    res.json({ ok: true, message: "consumer's ready" });
  } catch (error) {
    res.json({ ok: false, message: error });
  }
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
