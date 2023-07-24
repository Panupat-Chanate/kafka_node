"use strict";
const kafka = require("kafka-node");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

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

server.listen(5000, () => {
  console.log("socket.io listening on *:5000");
});

listen("kafka-panu-topic", "g1").on("message", async function (msg) {
  console.log("ping", msg);
});

listen("kafka-panu-topic", "g1").on("message", async function (msg) {
  console.log("ping2", msg);
});
