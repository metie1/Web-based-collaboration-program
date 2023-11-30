var mysql = require('mysql2');
var db = mysql.createConnection({
    host: '203.234.62.187',
    port: 7999,
    user: 'tester',
    password: '1234',
    database: 'my_db' 
});
db.connect();

module.exports = db;