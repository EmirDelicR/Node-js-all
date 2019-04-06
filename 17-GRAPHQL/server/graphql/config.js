const graphqlServer = require("express-graphql");
const Schema = require("./schema");
const Resolver = require("./resolvers");

const setup = (app, testing = false) => {
  app.use(
    "/graphql",
    graphqlServer({
      schema: Schema,
      rootValue: Resolver,
      graphiql: testing,
      formatError(err) {
        if (!err.originalError) {
          return err;
        }
        const error = {
          data: err.originalError.data,
          message: err.message || "An error occurred!",
          status: err.originalError.code || 500
        };

        return error;
      }
    })
  );
};

module.exports = {
  setup
};
