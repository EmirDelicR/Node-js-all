const mongoose = require("mongoose");
const io = require("./websocket");
// TODO make this async
const connect = app => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true })
    .then(result => {
      const server = app.listen(process.env.PORT, process.env.HOST_NAME, () => {
        console.log(
          `Server running at http://${process.env.HOST_NAME}:${
            process.env.PORT
          }/`
        );
      });
      io.connect(server);
    })
    .catch(err => {
      console.log("Error from mongoose connection: ", err);
    });
};

exports.connect = connect;
