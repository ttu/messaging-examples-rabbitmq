import { createProducer, sendMessage } from './producer.js';
import { createConsumer } from './consumer.js';

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? 'p';
const id = myArgs[1] ?? 'A';
const exchangeName = myArgs[2] ?? 'default_topic';
const routingKey = myArgs[3] ?? '';

// node index.js type queue_name
const main = async () => {
  if (type === 'c') {
    await createConsumer(id, exchangeName, routingKey);
    return;
  }

  await createProducer(exchangeName);
  sendMessage('US', 'US event 1');
  sendMessage('DE', 'DE event 1');
  sendMessage('DE', 'DE event 2');
  sendMessage('US', 'US event 2');
  sendMessage('DE', 'DE event 3');
};

main();
