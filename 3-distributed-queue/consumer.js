import amq from 'amqplib';

const URL = 'amqp://localhost';

const openConnection = amq.connect(URL);

let consumerId;
let channel;

export const createConsumer = async (id, excchangeToListenName = 'default_topic', routingKey= '') => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertExchange(excchangeToListenName, 'topic', { durable: false });
      // Leave queue_name to empty to create new queue each time
      const queueInfo = await channel.assertQueue(`my_exchange_tasks_${id}`); 
      await channel.bindQueue(queueInfo.queue, excchangeToListenName, routingKey);
      return channel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  channel.ack(msg);
};
