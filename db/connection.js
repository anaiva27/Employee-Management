const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "27qweasd",
  database: "employees",
});

// connect to the mysql server and sql database
connection.query = util.promisify(connection.query);
connection.connect(function (err) {
  if (err) throw err;
});
module.exports = connection;