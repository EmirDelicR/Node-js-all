const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 3306
});

module.exports = pool.promise();
