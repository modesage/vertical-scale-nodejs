import express from "express";

const port = process.env.PORT || 3000;

const app = express();
console.log(`Process ${process.pid} starting up`);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pid", (req, res) => {
  res.send(`Process ID is ${process.pid}`);
});

app.get("/api/:n", (req, res) => {
  let n = parseInt(req.params.n);
  let count = 0;
  if (n > 5e9) n = 5e9;
  for (let i = 0; i <= n; i++) {
    count += i;
  }
  res.send(`Final count is ${count} ${process.pid}`);
});

app.listen(port, () => {
  console.log(`Process ${process.pid} listening on port ${port}`);
});
