var mysql = require('mysql2');
var db = mysql.createConnection({
    host: '203.234.62.38',
    port: 3307,
    user: 'u2301448',
    password: 'u2301448!',
    database: 'DB' 
});
db.connect();

module.exports = db;