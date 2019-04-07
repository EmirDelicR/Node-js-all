const helpers = require("../util/helpers");

module.exports = {
  cors: (req, res, next) => {
    // Set this to your client side - like localhost:3000/
    // * means allow to all
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },

  error: (error, req, res, next) => {
    console.log("From error middleware: ", error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data || null;
    res.status(status).json({ message: message, data: data });
  },

  isAuth: (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not authenticated!");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = helpers.verifyJWT(token);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not authenticated!");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  }
};
