const dotenv = require("dotenv");
dotenv.config({ debug: true });
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// Parse incoming JSON data
app.use(bodyParser.json());

// Import multer for file upload
const fileUpload = require("./util/file");
app.use(fileUpload.registerMulter);

// Serve static folders
app.use("/images", express.static(path.join(__dirname, "images")));

// Import routes
const feedRoutes = require("./routes/feed/feed");
const authRoutes = require("./routes/auth/auth");

// Import db connection
const db = require("./util/db");

// Import cors settings
const middleware = require("./middleware/middleware");
app.use(middleware.cors);

// Register routes
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// register error middleware
app.use(middleware.error);
db.connect(app);
