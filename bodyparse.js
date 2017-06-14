/*
 * 解析请求body
 */

var querystring = require('querystring');

module.exports = function (req, res) {
    let content = '';
    let jsonContent = '';
    req.bodypase = {};
    req.on('data', function (chunck) {
        content += chunck;
    });
    
    req.on('end', function () {
        jsonContent = querystring.parse(content);

        return jsonContent
    });
    
//  req.bodypase = jsonContent
    
}
