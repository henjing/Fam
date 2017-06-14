var url = require('url');
var querystring = require('querystring');
var UserModel = require('../models/user-model.js');
var crypted = require('../crypto/crypto.js');

var FAMUSERREGISTERKEY = 'famuserregisterkey';

module.exports = function (request, response) {

	var path = url.parse(request.url).path;
	
	// 首页
	if (path === '/' || path === '/index.html') {
	    
	    request.render('index.html');
	    
	}
	
	// 登陆页
	if (path === '/login.html') {
		
		request.render('login.html');
		
	}
	
	// 用户注册
	if (path === '/api/register') {
	    let content = '';
	    request.on('data', function (chunck) {
	        content += chunck; 
	    });
	    
	    request.on('end', function () {
	        let jsonContent = querystring.parse(content);
	        let checkPhone = /^1[34578]\d{9}$/.test(jsonContent.username);
	        let checkEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(jsonContent.username);
	        let checkPwd = /^[\w]{6,15}$/.test(jsonContent.password);
	        
	        function resaultFunc(msg) {
	            response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({
                    status: 0,
                    info: msg,
                }));
	        }
	        
	        // 数据校验
            if (!checkPhone && !checkEmail) {
                resaultFunc('用户名格式不正确，必须是手机或者邮箱！')
                return false;
            }
            
            if (!checkPwd) {
                resaultFunc('密码格式错误，应为6-15位！');
                return false;
            }
            
            if (jsonContent.confirmpwd !== jsonContent.password ) {
                resaultFunc('两次输入的密码不一致！')
                return false;
            }
            
	        // 查库检查改用户名是否已经
	        UserModel.findOne({
	            where: {
	                username: jsonContent.username,
	            }
	        }).then(function (data) {
	            if (!data) {
	                UserModel.create({
                        username: jsonContent.username,
                        password: crypted.encrypted(jsonContent.password, FAMUSERREGISTERKEY),
                    }).then(function (p) {
                        console.log(`created.{JSON.stringify(p)}`);
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({
                            status: 1,
                            info: '注册成功！',
                        }));
                    }).catch(function (err) {
                       console.log(`failed${err}`);
                    });
	            } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 0,
                        info: '该用户名已存在！',
                    }));
	            }
	        })
	       
	       
	    });
	}
	
	// 登陆请求
	if (path === '/api/login') {
        
        let content = '';
        request.on('data', function (chunck) {
            content += chunck;
        });
        
        request.on('end', function () {
//          console.log(content)
            let jsonContent = querystring.parse(content);
            
            // 根据用户名查数据库
            UserModel.findOne({
                where: {
                    username: jsonContent.username
                }
            }).then(function (data) {
//              console.log(data)
                // 加密
                let password = crypted.encrypted(jsonContent.password, FAMUSERREGISTERKEY);
                if (data && data.password === password) {
                    // 保存session
                    request.session.put('userinfo', {
                        uid: data.uid,
                        username: data.username,
                        regtime: new Date(data.regtime).toLocaleString(),
                    });
                    
                    console.log(request.session)
                    
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 1,
                        info: '登陆成功！',
                        userInfo: request.session.get('userinfo')
                    }));
                } else if (data && data.password !== password) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 0,
                        info: '密码错误！',
                        
                    }));
                } else if (!data) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 0,
                        info: '该用户不存在！',
                        
                    }));
                }
            }).catch(function (err) {
                console.log(err)
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({
                    status: 0,
                    info: err,
                    
                }));
            });
           
        });
        
    }
	
};