const kafka = require("kafka-node");

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
  idleConnection: 24 * 60 * 60 * 1000,
  kafkaHost: "localhost:9092",
});

const consume = (cb) => {
  const consumer = new Consumer(
    client,
    [{ topic: "kafka-panu-topic", partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: "utf8",
      fromOffset: true,
    }
  );

  consumer.on("message", async function (message) {
    cb(message);
  });

  consumer.on("error", function (error) {
    console.log("error", error);
  });
};

module.exports = consume;