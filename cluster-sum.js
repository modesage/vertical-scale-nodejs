import cluster from 'cluster';
import os from 'os';

const max = 5e9;

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  const chunk = Math.floor(max / cpuCount);
  const results = new Array(cpuCount).fill(0);
  let done = 0;

  console.log(`Primary ${process.pid} dividing work among ${cpuCount} workers...`);

  for (let i = 0; i < cpuCount; i++) {
    const start = i * chunk + 1;
    const end = (i === cpuCount - 1) ? max : (i + 1) * chunk;
    const worker = cluster.fork();

    worker.send({ start, end, i });

    worker.on('message', ({ i, partial }) => {
      results[i] = partial;
      done++;

      if (done === cpuCount) {
        const total = results.reduce((a, b) => a + b, 0);
        console.log(`\nTotal Sum = ${total}`);
      }
    });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} exited.`);
  });

} else {
  process.on('message', ({ start, end, i }) => {
    console.log(`Worker ${process.pid} → ${start} to ${end}`);
    let sum = 0;
    for (let n = start; n <= end; n++) sum += n;
    process.send({ i, partial: sum });
    process.exit();
  });
}
