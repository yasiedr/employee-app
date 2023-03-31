const mysql = require("mysql2/promise");

const db = (() => {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "office_db",
  });
})();

module.exports = db;