const kafka = require("kafka-node");

const consumer = async ({ topic, socketid }, cb) => {
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient({
    idleConnection: 24 * 60 * 60 * 1000,
    kafkaHost: "localhost:9092",
    groupId: socketid,
  });
  const consumer = new Consumer(client, [{ topic: topic, partition: 0 }], {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "utf8",
    fromOffset: true,
    keyEncoding: "utf8",
  });

  consumer.on("message", async function (message) {
    cb(message);
  });

  consumer.on("error", function (error) {
    console.log("error", error);
  });
};

module.exports = consumer;
