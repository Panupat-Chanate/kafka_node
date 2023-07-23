const kafka = require("kafka-node");
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
  idleConnection: 24 * 60 * 60 * 1000,
  kafkaHost: "localhost:9092",
});
const consumer = new Consumer(client, [{ topic: topic, partition: 0 }], {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: "utf8",
  fromOffset: true,
});

exports.init = (cb) => {
  consumer.on("message", async function (message) {
    cb(message);
  });
};
