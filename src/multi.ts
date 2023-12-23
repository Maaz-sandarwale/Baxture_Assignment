// index.js
const cluster = require("cluster");
const os = require("os");
const { createServer } = require("http");
const { exec } = require("child_process");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker: any) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const PORT = process.env.PORT || 4000 + cluster.worker.id;

  // Run TypeScript file using ts-node
  const childProcess = exec(`ts-node ${__dirname}/app.ts`, (error: any) => {
    if (error) {
      console.error(`Error running app.ts: ${error}`);
    }
  });

  childProcess.stdout.on("data", (data: any) => {
    console.log(data);
  });

  childProcess.stderr.on("data", (data: any) => {
    console.error(`Error from app.ts: ${data}`);
  });

  // Optionally, create an HTTP server if your app.ts doesn't start a server
  const server = createServer((req: any, res: any) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  });

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started. Listening on port ${PORT}`);
  });
}
