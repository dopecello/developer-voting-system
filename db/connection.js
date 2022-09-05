const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'dopecello',
  // Your MySQL password
  password: 'Jax123!@#',
  database: 'election'
});

module.exports = db;
