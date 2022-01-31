import amq from "amqplib";

const URL = "amqp://localhost";

const openConnection = amq.connect(URL);

let consumerId;
let consumer_channel;
let producer_channel;
let queue_replies;

export const start = async () => {
  await createConsumer("important_tasks_receiver");
  await createProducer();
};

const createConsumer = async (id, queue_name = "default_requests") => {
  consumerId = id;

  return openConnection
    .then(async (conn) => {
      consumer_channel = await conn.createChannel();
      const queueInfo = await consumer_channel.assertQueue(queue_name);
      return consumer_channel.consume(queueInfo.queue, handleMessage);
    })
    .catch((err) => false);
};

const createProducer = async (queue_name = "default_replies") => {
  queue_replies = queue_name;
  return openConnection
    .then(async (conn) => {
      producer_channel = await conn.createChannel();
      await producer_channel.assertQueue(queue_replies);
      return true;
    })
    .catch((err) => false);
};

const handleMessage = (msg) => {
  if (msg === null) return;
  console.log(`${consumerId} received`, { msg: msg.content.toString() });
  consumer_channel.ack(msg);
  sendMessage(msg.content.toString() + '_ok');
};

const sendMessage = (msg) => {
  if (!producer_channel) return false;
  console.log("Sending", { msg });
  return producer_channel.sendToQueue(queue_replies, Buffer.from(msg));
};
