// Import routes
const fileRoutes = require("./file/file");

const registerRoutes = app => {
  app.use("/file", fileRoutes);
};

exports.registerRoutes = registerRoutes;
