const mongoose = require('mongoose');
const print = require('../utils/print');
const checkTestingEnv = require('../utils/process');

const mongoDbConnect = async (callback) => {
  const dbUrl = checkTestingEnv()
    ? process.env.MONGO_CONNECTION_URL_TEST
    : process.env.MONGO_CONNECTION_URL;
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    print('Connection with MongoDb is established!', 'success');
    callback();
  } catch (err) {
    print(`Error from Mongoose connect: ${err}`, 'error');
    throw err;
  }
};

exports.mongoConnect = mongoDbConnect;
