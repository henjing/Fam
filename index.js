'use strict';

var http = require('http');

var staticFiles = require('./static-file.js');
var indexController = require('./controllers/indexController.js');

var server = http.createServer(function (request, response) {
	
    staticFiles(request, response);
    indexController(request, response);
    
});

server.listen(8080);

console.log('Server is running at http://localhost:8080/')

