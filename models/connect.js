
const mysql = require('mysql');

let isProduction = process.env.NODE_ENV === 'production';

// 开发环境数据库配置
const connectionDev = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'fam'
});

// 生产环境数据库配置
const connectionPro = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hej193856',
    database: 'fam'
});

module.exports = isProduction === true ? connectionPro : connectionDev;