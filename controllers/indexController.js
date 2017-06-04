var render = require('../template-render.js');
var url = require('url');
var querystring = require('querystring');
var UserModel = require('../models/user-model.js');

console.log(render)

module.exports = function (request, response) {

	var path = url.parse(request.url).path;
	
	// 首页
	if (path === '/' || path === '/index.html') {
	    
	    render(response, 'index.html', {
	        name1: '收藏夹',
            name2: '账号管理'
	    });
	    
	}
	
	// 登陆页
	if (path === '/login.html') {
		
		render(response, 'login.html');
		
	}
	
	// 用户注册
	if (path === '/api/register') {
	    let content = '';
	    request.on('data', function (chunck) {
	        content += chunck; 
	    });
	    
	    request.on('end', function () {
	        let jsonContent = querystring.parse(content);
	        console.log(jsonContent)
	       
	       // 查库检查改用户名是否已经
	        UserModel.findOne({
	            where: {
	                username: jsonContent.phone,
	            }
	        }).then(function (data) {
	            if (!data) {
	                UserModel.create({
                        username: jsonContent.phone,
                        password: jsonContent.pwd,
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
                    username: jsonContent.phone
                }
            }).then(function (data) {
                console.log(data)
                if (data && data.password === jsonContent.pwd) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 1,
                        info: '登陆成功！',
                        userInfo: {
                            uid: data.uid,
                            phone: data.username,
                        }
                    }));
                } else if (data && data.password !== jsonContent.pwd) {
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
            });
           
        });
        
    }
	
	// 搜藏夹
	if (path === '/favorite.html') {
	    
	    render(response, 'favorite.html', {
	        lists: [
                {
                    id: 1,
                    title: '我是标题',
                    decr: '这里是描述，这里真的是描述。'
                },
                {
                    id: 2,
                    title: '我是标题1',
                    decr: '这里是描述，这里真的是描述1。'
                },
                {
                    id: 3,
                    title: '我是标题2',
                    decr: '这里是描述，这里真的是描述2。'
                }
            ]
	    });
		
	}
}