
const fastify = require('fastify')({ logger: true });
const { Kafka } = require('../common/kafka');

const PORT = process.env.CONSUMER_PORT || 3003;

const consumedMessaged = [];

const kafkaStart = async () => {
    const consumer = Kafka.consumer({groupId: "poc-group"});
    await consumer.connect();
    await consumer.subscribe({ topic: 'poc', fromBeginning: true });
    await consumer.run({ 
        eachMessage: async ({ topic, partition, message }) => {
            consumedMessaged.push(message.value.toString())
        }
    })
}

fastify.get('/', async (request, reply) => {
    return "Welcome Consumer!"
});

fastify.get('/get-messages', async (request, reply) => {
    return {"messages": consumedMessaged}
})

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}


start();
kafkaStart();