import express from "express";

export const app = express();
console.log(`Worker ${process.pid} started`);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pid", (req, res) => {
  res.send(`Process ID is ${process.pid}`);
});

app.get("/api/:n", (req, res) => {
  let n = parseInt(req.params.n);
  let count = 0;

  if (n > 5000000000) n = 5000000000;

  for (let i = 0; i <= n; i++) {
    count += i;
  }

  res.send(`Final count is ${count} ${process.pid}`);
});
