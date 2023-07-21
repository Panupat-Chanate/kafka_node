const kafka = require("kafka-node");

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

const produce = async (cb) => {
  const payload = [
    {
      topic: "kafka-panu-topic",
      key: 515,
      messages: "test-panu",
      timestamp: Date.now(),
    },
  ];

  producer.send(payload, (error, data) => {
    cb(data);
  });

  producer.on("error", function (error) {
    console.log("error", error);
  });
};

module.exports = produce;
