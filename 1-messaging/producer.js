import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let queueName;

export const createProducer = async (queueToSendName = 'default_tasks') => {
  queueName = queueToSendName;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertQueue(queueName);
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (msg) => {
  if (!channel) return false;
  console.log('Sending', { msg });
  return channel.sendToQueue(queueName, Buffer.from(msg));
};
