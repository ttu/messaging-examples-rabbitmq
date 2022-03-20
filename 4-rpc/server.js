import amq from "amqplib";

const URL = "amqp://localhost";

const openConnection = amq.connect(URL);

let consumerId;
let consumerChannel;
let producerChannel;
let replyQueueName;

export const start = async () => {
  await createConsumer("important_tasks_receiver");
  await createProducer();
};

const createConsumer = async (id, queueToListenName = "default_requests") => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      consumerChannel = await conn.createChannel();
      const queueInfo = await consumerChannel.assertQueue(queueToListenName);
      return consumerChannel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const createProducer = async (queueToSendName = "default_replies") => {
  replyQueueName = queueToSendName;
  return openConnection
    .then(async (conn) => {
      producerChannel = await conn.createChannel();
      await producerChannel.assertQueue(replyQueueName);
      return true;
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  consumerChannel.ack(msg);
  sendMessage(msg.content.toString() + '_ok');
};

const sendMessage = (msg) => {
  if (!producerChannel) return false;
  console.log("Sending", { msg });
  return producerChannel.sendToQueue(replyQueueName, Buffer.from(msg));
};
