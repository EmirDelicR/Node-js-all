const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const hostname = "127.0.0.1";
const port = 3000;

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

/** Handle 404 errors */
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/** Init server */
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
