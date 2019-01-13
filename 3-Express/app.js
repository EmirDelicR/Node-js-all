const path = require("path");

const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const bodyParser = require("body-parser");

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

/** Handle 404 errors */
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/** Init server */
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
