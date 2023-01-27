const mysql = require("mysql-await");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "dt5.ehb.be",
  user: "2223PRJALIAMRANI",
  password: "FTWdU2",
  database: "2223PRJALIAMRANI"
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;