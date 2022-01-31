# Basic Tutorial for Messaging

NOTE: We use term messages instead of events

This is a good guide: https://www.rabbitmq.com/getstarted.html

## Messaging

1. Producer sends messages
2. Consumer receives and processes messages

![image](https://www.rabbitmq.com/img/tutorials/python-one.png)

```sh
# start consumer
node 1-messaging/index.js c hello_consumer hello_queue
# start producer
node 1-messaging/index.js p hello_producer hello_queue
```

## Worker Queue / Distributed tasks

![image](https://www.rabbitmq.com/img/tutorials/python-two.png)

We can add more consumers to have more processing power

1. Producer sends messages
2. Message bus distributes messages evenly to Consumers (usually distributed with round robin)

```sh
# start consumer multiple consumers
node 1-messaging/index.js c hello_consumer_first shared_hello_queue
node 1-messaging/index.js c hello_consumer_second shared_hello_queue
# start producer
node 1-messaging/index.js p hello_producer shared_hello_queue
```

## Publish Subscribe / Event driven

![image](https://www.rabbitmq.com/img/tutorials/python-three.png)

1. Producer sends message (event)
2. Instead of going to predifined queue it is sent to an exchange
3. Messge bus routes events from the topic to queues that are attached to it
4. Consumers will receive every message from their queue

```sh
# start consumer multiple consumers
node 2-worker/index.js c hello_consumer_first hello_exchange
node 2-worker/index.js c hello_consumer_second hello_exchange
# start producer
node 2-worker/index.js p hello_producer hello_exchange
```

## Distributed worker queue

![image](https://www.rabbitmq.com/img/tutorials/python-five.png)

1. Producer sends message (event)
2. Exchange uses a routing key to send message to correct queue 
4. Consumers will receive every message from their queue

```sh
# start consumer multiple consumers
node 3-distributed-queue/index.js c consumer_us distributed_exchange US
node 3-distributed-queue/index.js c consumer_de distributed_exchange DE
# start producer
node 3-distributed-queue/index.js p hello_producer distributed_exchange
```

### Problems
* Set up of exchanges more complicated

## Request Reply Pattern

Remote Procedure Call / Replies to sender

![image](https://www.rabbitmq.com/img/tutorials/python-six.png)

Replies require an own queue. Producer is also Consumer and Consumer is a Producer...

1. Client uses a producer to send a message
2. Server receives a message with consumer
3. Server sends a message with producer
1. Client receives a message with consumer

```sh
# start server
node 4-rpc/index.js s
# start client
node 4-rpc/index.js c
```

### Star RabbitMQ server with Management UI

```
$ docker run -d --name example-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Port `5672` is for rabbitmq client communication

Port `15672` is for Management UI


Go to http://localhost:15672/ to open Management UI (
```
username: guest
password: guest
```


### Write some code

[AMQP 0-9-1 library and client for Node.JS](https://github.com/squaremo/amqp.node)

`example_github_async.js` and `example_github_promise.js` are async versions of https://github.com/squaremo/amqp.node#promise-api-example

