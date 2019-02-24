const Sequelize = require("sequelize");

const dataBase = {
  username: "root",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  options: {
    dialect: "mysql",
    host: "localhost",
    port: 3306
  }
};

const sequelize = new Sequelize(
  dataBase.database,
  dataBase.username,
  dataBase.password,
  dataBase.options
);

module.exports = sequelize;
