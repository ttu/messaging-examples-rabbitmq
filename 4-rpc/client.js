import amq from 'amqplib';

const URL = 'amqp://localhost';

const openConnection = amq.connect(URL);

let consumerId;
let consumer_channel;
let producer_channel;
let queue_requests;

export const start = async () => {
  await createProducer();
  await createConsumer('important_tasks_creator');
};

export const createProducer = async (queue_name = 'default_requests') => {
  queue_requests = queue_name;
  return openConnection
    .then(async (conn) => {
      producer_channel = await conn.createChannel();
      await producer_channel.assertQueue(queue_requests);
      return true;
    })
    .catch((err) => false);
};

export const createConsumer = async (id, queue_name = 'default_replies') => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      consumer_channel = await conn.createChannel();
      const queueInfo = await consumer_channel.assertQueue(queue_name);
      return consumer_channel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  consumer_channel.ack(msg);
};

export const sendMessage = (msg) => {
  if (!producer_channel) return false;
  console.log('Sending request', { msg });
  return producer_channel.sendToQueue(queue_requests, Buffer.from(msg));
};



