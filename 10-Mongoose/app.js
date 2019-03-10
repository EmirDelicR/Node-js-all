const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
dotenv.config({ debug: true });
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const app = express();

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const hostname = "127.0.0.1";
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5c84ea1dd53d6531c5d83634")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log("Error from User middleware: ", err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Emir",
          email: "emir@test.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch(err => {
    console.log("Error from mongoose connection: ", err);
  });
