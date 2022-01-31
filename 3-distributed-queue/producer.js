import amq from 'amqplib';

const URL = 'amqp://localhost';
const openConnection = amq.connect(URL);

let channel;
let exchange;

export const createProducer = async (exchange_name = 'default_topic') => {
  exchange = exchange_name;
  return openConnection
    .then(async (conn) => {
      channel = await conn.createChannel();
      await channel.assertExchange(exchange_name, 'topic', { durable: false });
      return true;
    })
    .catch((err) => false);
};

export const sendMessage = (key, msg) => {
  if (!channel) return false;
  console.log('Key', { key });
  console.log('Sending', { msg });
  return channel.publish(exchange, key, Buffer.from(msg));
};
