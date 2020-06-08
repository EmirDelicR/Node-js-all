const server = require('./src/module/app');
require('./src/module/socket');
const { port, hostname } = require('./src/utils/constants').server;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
