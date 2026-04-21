const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const logFile = path.join(root, "server.log");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function log(message) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

const server = http.createServer((req, res) => {
  log(`request ${req.method} ${req.url}`);

  const requestPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const safePath = path.normalize(path.join(root, requestPath));

  if (!safePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    log(`forbidden ${requestPath}`);
    return;
  }

  fs.readFile(safePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      log(`not-found ${safePath}`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
    log(`served ${safePath}`);
  });
});

server.on("error", (error) => {
  log(`server-error ${error.stack || error.message}`);
});

process.on("uncaughtException", (error) => {
  log(`uncaught ${error.stack || error.message}`);
});

process.on("unhandledRejection", (error) => {
  log(`unhandled ${error && error.stack ? error.stack : error}`);
});

server.listen(3000, "0.0.0.0", () => {
  log(`listening on http://127.0.0.1:3000 root=${root}`);
});
