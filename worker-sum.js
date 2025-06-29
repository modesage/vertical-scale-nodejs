// worker-sum.js
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';

const max = 5e9;

if (isMainThread) {
  const numThreads = os.cpus().length;
  const chunkSize = Math.floor(max / numThreads);
  const results = new Array(numThreads).fill(0);
  let completed = 0;

  console.log(`Main thread ${process.pid} starting ${numThreads} workers`);

  for (let i = 0; i < numThreads; i++) {
    const start = i * chunkSize + 1;
    const end = (i === numThreads - 1) ? max : (i + 1) * chunkSize;

    const worker = new Worker(new URL(import.meta.url), {
      workerData: { start, end, index: i }
    });

    worker.on('message', ({ index, partial }) => {
      results[index] = partial;
      completed++;

      console.log(`Worker ${index} finished: partial = ${partial}`);

      if (completed === numThreads) {
        const total = results.reduce((a, b) => a + b, 0);
        console.log(`\nFinal Total = ${total}`);
      }
    });

    worker.on('error', err => {
      console.error(`Worker ${i} error:`, err);
    });

    worker.on('exit', code => {
      if (code !== 0) {
        console.error(`Worker ${i} exited with code ${code}`);
      }
    });
  }

} else {
  const { start, end, index } = workerData;
  let sum = 0;
  for (let i = start; i <= end; i++) {
    sum += i;
  }

  parentPort.postMessage({ index, partial: sum });
}
