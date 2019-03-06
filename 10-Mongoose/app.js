const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ debug: true });

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
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
  User.findById("5c7c08f71c9d4400006f57df")
    .then(user => {
      req.user = new User(user);
      next();
    })
    .catch(err => console.log("Error from User middleware: ", err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
