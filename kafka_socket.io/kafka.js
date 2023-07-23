"use strict";
const kafka = require("kafka-node");

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
  idleConnection: 24 * 60 * 60 * 1000,
  kafkaHost: "localhost:9092",
});

const listen = function (topic, consumerGroup) {
  const consumer = new Consumer(client, [{ topic: topic }], {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "utf8",
    fromOffset: true,
    keyEncoding: "utf8",
  });
  return consumer;
};

listen("kafka-panu-topic", "g1").on("message", function (msg) {
  console.log("ping", msg);
});
