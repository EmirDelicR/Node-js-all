const http = require("http");
const routes = require("./routes");

console.log(routes.someText);

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(routes.handler);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
