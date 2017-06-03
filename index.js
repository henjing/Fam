//'use strict';

var http = require('http');

var staticServer = require('./static-file.js');

var server = http.createServer(function (request, response) {
    staticServer(request, response)  
});

server.listen(8080);

console.log('Server is running at http://localhost:8080/')

