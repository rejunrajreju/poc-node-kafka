const fastify = require('fastify')({logger:true});
const {Kafka} = require('../common/kafka');

const PORT = process.env.PRODUCER_PORT||3000;

const startKafkaProducer = async () => {
    const producer = Kafka.producer();
    await producer.connect();
    return producer;
}

(async () => {
    const producer = await startKafkaProducer().catch(console.log);

    const sendMessage = async (obj) => {
        await producer.send({ topic: 'poc', messages: [{value: JSON.stringify(obj)}]})
    };

    fastify.get('/', async()=>{
        return "Welcome Producer!";
    });

    fastify.get('/:message', async(request, replay)=>{
        const {message} = request.params;
        try {
            await sendMessage({message});
            return { message };
        } catch(e) {
            return {"error": JSON.stringify(e)}
        }
    });

    const start = async() => {
        try {
            fastify.listen(PORT);
        } catch (e) {
            fastify.log.error(e);
            process.exit(1);
        }
    }

    start();

})()


