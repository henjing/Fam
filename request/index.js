/*
 * 发起网络请求
 */
const http = require('http');

/*
 * 发起GET请求
 * 
 * @pparam {string} urlStr
 * @param {function} callback
 */
exports.getRequest = (urlStr, callback) => {
    http.get(urlStr, (res) => {
        let body = '';
        res.on('data', (d) => {
            body += d; 
        });
        
        res.on('end',() => {
            callback(body);
        });
    });
}

/*
 * 发起POST请求
 * 
 * @param {string} data
 * @param {object} opt
 * @param {function} callback
 */
exports.postRequest = (data, opt, callback) => {
    const request = http.request(opt, (response) => {
        let body = '';
        response.on('data', (d) => {
            body += d;
        });
        
        response.on('end', () => {
            callback(body);
        });
    });
    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    request.write(data);
    request.end();  
}
