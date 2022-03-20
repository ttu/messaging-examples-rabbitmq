import amq from 'amqplib';

const URL = 'amqp://localhost';

const openConnection = amq.connect(URL);

let consumerId;
let consumerChannel;
let producerChannel;
let requestQueueName;

export const start = async () => {
  await createProducer();
  await createConsumer('important_tasks_creator');
};

export const createProducer = async (queueToSendName = 'default_requests') => {
  requestQueueName = queueToSendName;
  return openConnection
    .then(async (conn) => {
      producerChannel = await conn.createChannel();
      await producerChannel.assertQueue(requestQueueName);
      return true;
    })
    .catch((err) => false);
};

export const createConsumer = async (id, queueToListenName = 'default_replies') => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      consumerChannel = await conn.createChannel();
      const queueInfo = await consumerChannel.assertQueue(queueToListenName);
      return consumerChannel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  consumerChannel.ack(msg);
};

export const sendMessage = (msg) => {
  if (!producerChannel) return false;
  console.log('Sending request', { msg });
  return producerChannel.sendToQueue(requestQueueName, Buffer.from(msg));
};



