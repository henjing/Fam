'use strict';

var http = require('http');
var NodeSession = require('node-session');
var staticFiles = require('./static-file.js');
var indexController = require('./controllers/indexController.js');
var favoriteController = require('./controllers/favoriteController.js');

var connection = require('./connection.js');
var renderTemplate = require('./template-render.js');
var bodypase = require('./bodyparse.js');

var session = new NodeSession({
    'secret': 'abkdfhakdfasdfdfasdTHSISkjfa',
    'lifetime': 20 * 60 * 1000,
});

//console.log(http)

var server = http.createServer(function (request, response) {
    console.log('hello')
	session.startSession(request, response, function() {
	    // 静态文件服务器
	    staticFiles(request, response);
//	    console.log('请求前')
	    // 解析请求body
//	    bodypase(request, response);
//	    console.log('请求后')
	    // 连接数据库
	    connection(request);
	    
	    // 模板渲染
	    renderTemplate(request, response);
	    
	    // 控制器
        indexController(request, response);
        favoriteController(request, response);
	});
	
});

server.listen(80,function () {
    console.log('Server is running at http://localhost:80/')
});




