var env = require('../template-render.js');
var url = require('url');

module.exports = function (request, response) {

	var path = url.parse(request.url).path;
	console.log(path)
	
	if (path === '/' || path === '/index.html') {
		
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(env.render('index.html',{
	    	name1: '收藏夹',
	    	name2: '账号管理'
	    }));
	    
	} else if (path === '/login.html') {
		
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(env.render('login.html'));
		
	} else if (path === '/favorite.html') {
		
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(env.render('favorite.html',{
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
	    }));
	    
	}
}