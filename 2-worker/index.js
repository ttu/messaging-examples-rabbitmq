import { createProducer, sendMessage } from './producer.js';
import { createConsumer } from './consumer.js';

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? 'p';
const id = myArgs[1] ?? 'A';
const exchangeName = myArgs[2] ?? 'default_tasks';

// node index.js type queue_name
const main = async () => {
  if (type === 'c') {
    await createConsumer(id, exchangeName);
    return;
  }

  await createProducer(exchangeName);
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
