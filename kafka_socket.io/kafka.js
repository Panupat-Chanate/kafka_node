const kafka = require("kafka-node");
const client = new kafka.KafkaClient({
  idleConnection: 24 * 60 * 60 * 1000,
  kafkaHost: "localhost:9092",
});
const consumerGroup = new kafka.ConsumerGroup(client, "kafka-panu-topic");

exports.init = (cb) => {
  consumerGroup.on("message", function (message) {
    console.log("Kafka consumer message listner call");
    cb(message);
  });
};
