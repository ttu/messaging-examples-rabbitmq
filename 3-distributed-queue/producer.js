import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let exchangeName;

export const createProducer = async (exchangeToSendName = 'default_topic') => {
  exchangeName = exchangeToSendName;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertExchange(exchangeName, 'topic', { durable: false });
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (key, msg) => {
  if (!channel) return false;
  console.log('Key', { key });
  console.log('Sending', { msg });
  return channel.publish(exchangeName, key, Buffer.from(msg));
};
