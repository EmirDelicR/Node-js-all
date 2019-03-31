const mongoose = require("mongoose");

const connect = app => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true })
    .then(result => {
      app.listen(process.env.PORT, process.env.HOST_NAME, () => {
        console.log(
          `Server running at http://${process.env.HOST_NAME}:${
            process.env.PORT
          }/`
        );
      });
    })
    .catch(err => {
      console.log("Error from mongoose connection: ", err);
    });
};

exports.connect = connect;
