const Kafka = require("kafka-node");
const config = require("./config");

const Producer = Kafka.Producer;
const client = new Kafka.KafkaClient({ kafkaHost: config.KafkaHost });
const producer = new Producer(client, { requireAcks: 0, partitionerType: 2 });

const pushDataToKafka = (dataToPush) => {
  try {
    let payloadToKafkaTopic = [
      {
        topic: config.KafkaTopic,
        topic: "topicName",
        messages: ["ด.ช.รามี่"],
        fullName: `นายภาณุพัฒน์ ชาเนตร`,
        role: "teacher",
        type: "text",
        key: 515,
        partition: 0,
        // attributes: 2,
        timestamp: Date.now(),
      },
    ];
    console.log(payloadToKafkaTopic);
    producer.on("ready", async function () {
      producer.send(payloadToKafkaTopic, (err, data) => {
        console.log("data: ", data);
      });

      producer.on("error", function (err) {
        //  handle error cases here
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const jsonData = require("./app_json.js");

pushDataToKafka(jsonData);
