// /config/db.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "cs2team51",
  password: "vnCDK1Gy61wnAv3WlFzQvY9gH",
  database: "cs2team51_db",
});

module.exports = db;
