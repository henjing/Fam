const connection = require('../models/connect');
const crypted = require('../crypto/crypto.js');

const FAM_USER_KEY = 'famuserregisterkey';
// 登录页
exports.index = (req, res, next) => {
    res.render('login.html');
};

// 登录请求
exports.login = (req, res, next) => {
    const data = req.body;
    console.log(data)
    // 加密
    const password = crypted.encrypted(data.password, FAM_USER_KEY);
    connection.query(`SELECT * FROM users WHERE username="${data.username}"`, (err, results) => {
        console.log(results)
        const result = results[0];
        if (err) {
            console.log(err);
            res.send({
                status: 0,
                info: err.message
            })
            return false;
        }
        
        if (result && result.password === password) {
            // 保存用户信息到session
            req.session.userInfo = {
                uid: result.uid,
                username: result.username,
                regtime: result.regtime,
            };
            
            res.send({
                status: 1,
                info: '登陆成功！',
            });
        } else if (result && result.password !== password) {
            res.send({
                status: 0,
                info: '密码错误！',
            });
        } else if (!result) {
            res.send({
                status: 0,
                info: '该用户名不存在！',
            });
        }
    });
};

// 注册请求
exports.register = (req, res, next) => {
    const data = req.body;
    let checkUsername = /^1[34578]\d{9}$/.test(data.username);
    let checkEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(data.username);
    let checkPwd = /^[\w]{6,15}$/.test(data.password);
    
    const resaultFunc = msg => {
        res.send({
            status: 0,
            info: msg
        });
    };
    
    if (!checkUsername && !checkEmail) {
        resaultFunc('用户名必须是手机或邮箱！');
        return false;
    }
    
    if (!checkPwd) {
        resaultFunc('密码应为6-15位！')
        return false;
    }
    
    if (data.password !== data.confirmpwd) {
        resaultFunc('两次输入的密码不一致！')
        return false;
    }
    // 密码加密准备入库
    const encryptPwd = crypted.encrypted(data.password, FAM_USER_KEY);
    // 查询是否已经存在
    const queryUserSql = `SELECT username FROM users WHERE username="${data.username}"`;
    // 创建用户入库
    const createSql = `INSERT INTO users VALUES(0, "${data.username}", "${encryptPwd}", now())`;
    
    connection.query(queryUserSql, (err, results) => {
//      console.log(results)
        if (err) {
            resaultFunc(err.message);
            return false;
        }
        
        if (results && results.length != 0) {
            resaultFunc('该用户已经存在！');
            return false;
        } else {
            connection.query(createSql, (err, result) => {
                if (err) {
                    resaultFunc(err.message);
                    return false;
                }
//              console.log(result)
                res.send({
                    status: 1,
                    info: '注册成功！'
                });
            });
        }
    })
};

// 修改密码请求
exports.changePassword = (req, res, next) => {
    res.send({
        status: 1,
        info: '修改密码'
    })
};