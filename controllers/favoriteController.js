
var url = require('url');
var querystring = require('querystring');
var FavoriteModel = require('../models/favorite-model.js');
var units = require('../unit/index.js');

module.exports = function (request, response) {
    var _url = url.parse(request.url);
    var path = url.parse(request.url).path.split('?')[0];
    var searchItem = querystring.parse(_url.query);
    
    /*
     * 返回操作错误信息方法
     * @param {string} msg
     */
    function backErrMessage(msg) {
        response.writeHead(200,{'Content-Type': 'application/json'});
        response.end(JSON.stringify({
            status: 0,
            info: msg
        }));
    }
    
    // 搜藏夹
    if (path === '/favorite.html') {
        // 验证登录
        if (!units.checkLogin(request, response)) return false;
        // 获取用户id
        const uid = request.session.get('userinfo').uid;
        
        // 获取当前页
        let currentPage = searchItem.page ? Number(searchItem.page) : 1;
        // 定义每页条数
        const limit = 10;
        // 定位当前页
        const dirPage = (currentPage - 1) * limit;
        
        /*
         * 分页查询方法
         */
        function queryLimitData() {
            // 查询总条数
            const queryCountSql = `SELECT COUNT(id) FROM favorites WHERE uid=${uid}`;
            request.connection.query(queryCountSql, function (err, result) {
                if (err) {
                    console.log(err);
                    backErrMessage(err.message);
                }
                
                // 获取总条数
                const items = result[0]['COUNT(id)'];
                // 计算总页数
                const totalPage = units.getPages(items, limit);
                // 将总页数转成数组
                const pages = units.numberChangeToArray(totalPage);
                // 查询当前页的数据
                const queryLimitSql = `SELECT * FROM favorites WHERE uid=${uid} ORDER BY addtime DESC LIMIT ${dirPage},${limit}`;
                request.connection.query(queryLimitSql, function (err, result) {
                    if (err) {
                        console.log(err);
                        backErrMessage(err.message);
                    }

                    request.render('favorite.html', {
                        lists: result,
                        pages: pages,
                        totalPage: totalPage,
                        currentPage: currentPage,
                        limit: limit,
                    });
                });
                
            });
        }
        
        if (searchItem && searchItem !== {} && searchItem.page) {
            queryLimitData();
            
        } else if (searchItem && searchItem !== {} && searchItem.search) {
            const qeurySearchSql = `SELECT * FROM favorites WHERE CONCAT (title,intro) LIKE "%${searchItem.search}%"`;
            request.connection.query(qeurySearchSql,function (err, result, fields) {
                if (err) {
                    console.log(err);
                    backErrMessage(err.message);
                }
                
                request.render('favorite.html', {
                    lists: result,
                });
            });
            
        } else {
            queryLimitData();
        }
        
    }
    
    // 添加收藏
    if (path === '/api/favorite') {
        // 验证登录
        if (!units.checkLogin(request, response)) return false;
        
        // 获取用户id
        let uid = request.session.get('userinfo').uid;
        
        let content = '';
        request.on('data', function (chunck) {
            content += chunck;
        });
        
        request.on('end', function () {
            let jsonContent = querystring.parse(content);
            console.log(jsonContent)
            if (jsonContent.title.trim() === '') {
                backErrMessage('标题不能为空！');
                return false;
            }
            
            let createSQL = `INSERT INTO favorites VALUES(0,${uid},"${jsonContent.title}","${jsonContent.link}","${jsonContent.intro}",now(),now())`;
            request.connection.query(createSQL, function (err, result) {
                if (err) {
                    console.log(err);
                    backErrMessage(err.message);
                } else {
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 1,
                        info: '添加成功！'
                    }));
                }
            });
        });
    }
    
    // 删除收藏
    if (path === '/api/favorite/delete') {
        // 登陆验证
        if (!units.checkLogin(request, response)) return false;
        
        let content = "";
        request.on('data', function (chunck) {
            content += chunck;
        });
        
        request.on('end', function () {
            let jsonContent = querystring.parse(content);
            console.log(jsonContent)
            request.connection.query(`DELETE FROM favorites WHERE id=${jsonContent.id}`, function (err, result, field) {
                if (err) {
                    console.log(err);
                    backErrMessage(err.message);
                } else {
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 1,
                        info: '删除成功！'
                    }));
                }
                
            })
            
        });
    }
    
    // 修改更新
    if (path === '/api/favorite/edit') {
        if (!units.checkLogin(request, response)) return false;
        
        let content = "";
        request.on('data', function (chunck) {
            content += chunck; 
        });
        
        request.on('end', function () {
            let jsonContent = querystring.parse(content);
            let updateSQL = `UPDATE favorites SET title="${jsonContent.title}",link="${jsonContent.link}",intro="${jsonContent.intro}",updatetime=now() WHERE id=${jsonContent.id}`;
            request.connection.query(updateSQL, function (err, result) {
                if (err) {
                    console.log(err);
                    backErrMessage(err.message);
                } else {
                    response.writeHead(200,{'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                        status: 1,
                        info: '修改成功！'
                    }));
                }
            });
        });
    }
}



















