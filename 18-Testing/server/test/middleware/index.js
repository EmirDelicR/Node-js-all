const { isAuthMiddlewareTest } = require("./isAuth.test");
const { corsMiddlewareTest } = require("./cors.test");

module.exports = {
  isAuthTest: isAuthMiddlewareTest,
  corsTest: corsMiddlewareTest
};
