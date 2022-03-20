import amq from 'amqplib';

const QUEUE_NAME = 'tasks';

const open = amq.connect('amqp://localhost');

// Producer
open
  .then((conn) => conn.createChannel())
  .then((ch) => [ch, ch.assertQueue(QUEUE_NAME)])
  .then(([ch, queueInfo]) => ch.sendToQueue(QUEUE_NAME, Buffer.from('something to do')))
  .catch(console.warn);

// Consumer
open
  .then((conn) => conn.createChannel())
  .then((ch) => [ch, ch.assertQueue(QUEUE_NAME)])
  .then(([ch, ok]) =>
    ch.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        console.log('Received:', msg.content.toString());
        ch.ack(msg);
      }
    }),
  )
  .catch(console.warn);
