const mysql = require("mysql-await");

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: procces.env.USER,
  password: procces.env.PASSWORD,
  database: procces.env.DATABASE
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;