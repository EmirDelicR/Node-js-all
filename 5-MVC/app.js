const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const errorController = require("./controllers/error");

app.set("view engine", "ejs");
app.set("views", "views");

const hostname = "127.0.0.1";
const port = 3001;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

/** Handle 404 errors */
app.use(errorController.get404);

/** Init server */
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
