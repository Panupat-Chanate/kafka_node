const kafka = require("kafka-node");

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

const produce = async ({ topic, key, message }) => {
  // const payload = [
  //   {
  //     topic: topic,
  //     key: key,
  //     messages: JSON.stringify(message),
  //     timestamp: message.timestamp,
  //   },
  // ];

  const payload = message.map((x) => ({
    topic: topic,
    key: key,
    messages: JSON.stringify(x),
    timestamp: message.timestamp,
  }));

  producer.send(payload, (error, data) => {
    console.log("producer: " + JSON.stringify(data));
  });

  producer.on("error", function (error) {
    console.log("error", error);
  });
};

module.exports = produce;
