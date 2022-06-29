const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass1234",
    database: "employees"
    
});

db.connect(function (err) {
    if (err) throw err; 
});

module.exports = db;