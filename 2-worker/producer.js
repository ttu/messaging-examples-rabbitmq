import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let exchangeName;

export const createProducer = async (exchangeToSendName = 'default_tasks') => {
  exchangeName = exchangeToSendName;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertExchange(exchangeName, 'fanout', { durable: false });
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (msg) => {
  if (!channel) return false;
  console.log('Sending', { msg });
  return channel.publish(exchangeName, '', Buffer.from(msg));
};
