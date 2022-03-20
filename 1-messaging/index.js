import { createProducer, sendMessage } from './producer.js';
import { createConsumer } from './consumer.js';

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? 'p';
const id = myArgs[1] ?? 'A';
const queueName = myArgs[2];

// node index.js type queue_name
const main = async () => {
  if (type === 'c') {
    await createConsumer(id, queueName);
    return;
  }

  await createProducer(queueName);
  sendMessage('1');
  sendMessage('2');
  sendMessage('3');
  sendMessage('4');
  sendMessage('5');
  sendMessage('6');
  sendMessage('7');
  sendMessage('8');
  sendMessage('9');
};

main();
