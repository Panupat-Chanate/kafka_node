const kafka = require("kafka-node");

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

const produce = async ({ key, message }) => {
  const payload = [
    {
      topic: "kafka-panu-topic",
      key: key,
      messages: JSON.stringify(message),
      timestamp: Date.now(),
    },
  ];

  producer.send(payload, (error, data) => {
    console.log("producer: " + data);
  });

  producer.on("error", function (error) {
    console.log("error", error);
  });
};

module.exports = produce;
