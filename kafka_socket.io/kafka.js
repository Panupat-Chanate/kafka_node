const kafka = require("kafka-node");
const consumerGroup = new kafka.ConsumerGroup(
  {
    host: "localhost:9092",
    kafkaHost: "localhost:9092",
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "utf8",
    fromOffset: true,
  },
  "kafka-panu-topic"
);

exports.init = (cb) => {
  consumerGroup.on("message", function (message) {
    console.log("Kafka consumer message listner call");
    cb(message);
  });
};
