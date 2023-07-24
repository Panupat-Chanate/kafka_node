const kafka = require("kafka-node");

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
  idleConnection: 24 * 60 * 60 * 1000,
  kafkaHost: "localhost:9092",
});

const onConsume = ({ topic }, cb) => {
  const consumer = new Consumer(client, [{ topic: topic, partition: 0 }], {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "utf8",
    fromOffset: true,
    keyEncoding: "utf8",
  });

  console.log(consumer);

  consumer.on("message", async function (message) {
    console.log(message);
    cb(message);
    consumer.close();
  });

  consumer.on("error", function (error) {
    console.log("error", error);
  });
};

const closeConsume = ({ topic }, cb) => {
  // consumer.close(true, function (message) {
  //   cb(message);
  // });
};

module.exports = { onConsume, closeConsume };
