const { Kafka } = require('kafkajs');

const kafkaInsta = new Kafka({
    clientId: "poc",
    brokers: ['localhost:9092']
});

module.exports = {
    Kafka: kafkaInsta
}