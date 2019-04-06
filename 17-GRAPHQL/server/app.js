const dotenv = require("dotenv");
dotenv.config({ debug: true });
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const { registerRoutes } = require("./routes/index");

// Parse incoming JSON data
app.use(bodyParser.json());

// Import multer for file upload
const fileUpload = require("./util/file");
app.use(fileUpload.registerMulter);

// Serve static folders
app.use("/images", express.static(path.join(__dirname, "images")));

// Import db connection
const db = require("./util/db");

// Import cors settings
const middleware = require("./middleware/middleware");
app.use(middleware.cors);
app.use(middleware.isAuth);

// Register routes
registerRoutes(app);

// Import GraphQL
const graphQl = require("./graphql/config");
graphQl.setup(app, true);

// register error middleware
app.use(middleware.error);
db.connect(app);
