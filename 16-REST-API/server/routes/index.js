// Import routes
const feedRoutes = require("./feed/feed");
const authRoutes = require("./auth/auth");

const registerRoutes = app => {
  app.use("/feed", feedRoutes);
  app.use("/auth", authRoutes);
};

exports.registerRoutes = registerRoutes;
