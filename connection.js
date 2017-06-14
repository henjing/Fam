
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'fam'
});

var connect = function (req) {
    req.connection = connection;
}

module.exports = connect;