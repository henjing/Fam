const http = require('http');
const querystring = require('querystring');
const parseXml = require('xml2js');
const request = require('../request/index');
// 访问首页
exports.index = (req, res, next) => {
    res.render('index.html',{
        title: 'fam管理工具',
    });
}

exports.traceData = (req, res, next) => {
    const postData = querystring.stringify({
        UserName: 'cdjt',
        UserPassword: '654321',
        PageNo: 1,
        pageSize: 10000
    });
    console.log(postData)
    const optxml = {
        hostname: '101.200.193.60',
        port: 9097,
        path: '/StringService/DataAcquireService.asmx/SensorDataSelUserAll',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;',
            'Content-Length': postData.length,
        }
    };
    
    request.postRequest(postData, optxml, (response) => {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        
        parseXml.parseString(response, function (err, result) {
            let jsonData = JSON.parse(result.string._);
            let areaData = {};
            /*
             * @param {string} areaNumber 区域编号
             * @param {object} item 数组循环输出的对象
             */
            function actionArea(areaNumber, item) {
                // 判断areaData对象的[areaNumber]属性是否存在，不存在则创建，该属性为数组
                // 如果已经存在则直接添加数组项
                if (areaData[areaNumber] === undefined) {
                    areaData[areaNumber] = [item];
                } else {
                    areaData[areaNumber].push(item);
                }
            }
            
            // 循环数组并赋值给areaData对象
            jsonData.data.forEach((item, index) => {
                switch (item.Location){
                    case '1':
                        actionArea('1', item);
                        break;
                case '2':
                    actionArea('2', item);
                    break;
                case '3':
                    actionArea('3', item);
                    break;
                case '4':
                    actionArea('4', item);
                    break;
                case '5':
                    actionArea('5', item);
                    break;
                case '6':
                    actionArea('6', item);
                    break;
                case '7':
                    actionArea('7', item);
                    break;
                    default:
                        break;
                }
            });
            // 返回数据
            res.render('trace.html',{
                data: areaData
            });
            
        });
    });
    
}


