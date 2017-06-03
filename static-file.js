
var url = require('url');
var path = require('path');
var fs = require('fs');
var root = path.resolve(process.argv[2] || '.');

function staticServer(request, response) {
    // 拼接文件路径
    var pathname = url.parse(request.url).pathname;
    var filepath = path.join(root, pathname);

    // 文件存在则返回文件内容否则返回404
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);
        } else if (!err && stats.isDirectory()) {
            console.log('is directory')
            response.writeHead(200);
            fs.createReadStream(path.join(filepath, 'index.html')).pipe(response);
        } else {
            console.log(`404${request.url}`);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
}

module.exports = staticServer;