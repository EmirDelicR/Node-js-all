const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true
  })
    .then(client => {
      console.log("Connection with MongoDb is established!");
      // Storing the access to DB
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log("Error from MongoClient connect: ", err);
      throw err;
    });
};

/**
 * Use this function to access DB without making connection again and again
 */
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No DB found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
