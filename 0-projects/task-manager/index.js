const mongoConnect = require('./src/utils/database').mongoConnect;
const app = require('./src/app');
const { port, hostname } = require('./src/utils/constants').server;

mongoConnect(() => {
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
