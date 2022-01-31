import { start, sendMessage } from "./client.js";
import { start as startServer } from "./server.js";

const myArgs = process.argv.slice(2);
const type = myArgs[0] ?? "p";
const id = myArgs[1] ?? "A";
const queue_name = myArgs[2];

// node index.js type queue_name
const main = async () => {
  if (type === "c") {
    await start();
    sendMessage("1");
    sendMessage("2");
    sendMessage("3");
    sendMessage("4");
    return;
  }

  await startServer();
};

main();
