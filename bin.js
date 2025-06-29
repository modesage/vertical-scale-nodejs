import cluster from "cluster";
import os from "os";
import { app } from "./index.js";

//there is no port conflict as
//In modern Node.js (Linux/Unix), the primary process owns the actual listening socket.
//The workers do not bind to the port directly — they are handed TCP connections 
// via IPC (inter-process communication) from the primary.

//we can use pm2 to manage the process
//pm2 start index.js -i max
//PM2 will fork the app across available CPU cores.

//The request load balancing is connection-based, not per HTTP request.
// So if a client uses keep-alive, all their requests might stick to one worker unless you use a load balancer to break this.
// The primary doesn't ask if a worker is free — it just sends the socket.
// A worker can only handle one synchronous task at a time (because Node.js is single-threaded inside).

//Browsers and HTTP clients often reuse connections via HTTP keep-alive.
// So even with cluster, many requests from the same browser may hit the same worker unless the connection is closed and reopened.

//hence	multiple requests can be processed in parallel by different workers.

const totalCPUs = os.cpus().length;

const port = 3000;

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
