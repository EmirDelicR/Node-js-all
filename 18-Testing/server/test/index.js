const middlewareTests = require("./middleware/index");
const controllerTests = require("./controllers/index");

middlewareTests.isAuthTest();
middlewareTests.corsTest();

controllerTests.authTest();
