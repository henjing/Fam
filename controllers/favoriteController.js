const connection = require('../models/connect');
const tools = require('../tools');
// 收藏夹首页
exports.index = (req, res, nex) => {
//  console.log(req.session.userInfo)
    // 验证登录
    if (!req.session.userInfo) {
        res.redirect('/login.html');
        return false;
    } 
    // 获取用户id
    const uid = req.session.userInfo.uid;
    
    // 获取当前页
    let currentPage = req.query.page ? Number(req.query.page) : 1;
    // 定义每页条数
    const limit = 12;
    // 定位当前页
    const dirPage = (currentPage - 1) * limit;
    
    /*
     * 分页查询方法
     */
    function queryLimitData() {
        const querySql = `SELECT COUNT(id) FROM favorites WHERE uid=${uid}`;
        connection.query(querySql, (err, result) => {
            if (err) {
                console.log(err);
            }
//          console.log(result)
            // 获取总条数
            const items = result[0]['COUNT(id)'];
            // 计算总页数
            const totalPage = tools.getPages(items, limit);
            // 将总页数转成数组
            const pages = tools.numberChangeToArray(totalPage);
            // 查询当前页的数据
            const queryLimitSql = `SELECT * FROM favorites WHERE uid=${uid} ORDER BY addtime DESC LIMIT ${dirPage},${limit}`;
            connection.query(queryLimitSql, (err, result) => {
                if (err) {
                    res.send({
                        status: 0,
                        info: err.message
                    });
                }
    
                res.render('favorite.html', {
                    lists: result,
                    pages: pages,
                    totalPage: totalPage,
                    currentPage: currentPage,
                    limit: limit,
                });
            });
        });
    }
    
    if (req.query.page) {
        queryLimitData();
    } else if (req.query.search) {
        const qeurySearchSql = `SELECT * FROM favorites WHERE uid=${uid} AND CONCAT (title,intro) LIKE "%${req.query.search}%"`;
        connection.query(qeurySearchSql, (err, result, fields) => {
            if (err) {
                res.send({
                    status: 0,
                    info: err.message
                });
            }
            
            res.render('favorite.html', {
                lists: result,
            });
        });
    } else {
        queryLimitData();
    }
     
};

// 添加收藏
exports.add = (req, res, next) => {
    // 接口验证登录是否有效
    if (!req.session.userInfo) {
        res.send({
            status: 2,
            info: '登录过期，请重新登录！'
        });
        return false;
    };
    // 获取用户id
    const uid = req.session.userInfo.uid;
    
    const data = req.body;
    
    if (data.title.trim() === '') {
        res.send({
            status: 0,
            info: '标题不能为空！'
        });
        return false;
    }
    
    const createSQL = `INSERT INTO favorites VALUES(0,${uid},"${data.title}","${data.link}","${data.intro}",now(),now())`;
    connection.query(createSQL, function (err, result) {
        if (err) {
            res.send({
                status: 0,
                info: err.message
            });
        } else {
            res.send({
                status: 1,
                info: '添加成功！'
            });
        }
    });
};

// 编辑收藏
exports.edit = (req, res, next) => {
    // 接口验证登录是否有效
    if (!req.session.userInfo) {
        res.send({
            status: 2,
            info: '登录过期，请重新登录！'
        });
        return false;
    };
    const data = req.body;
    const queryChangeSql = `SELECT title, link, intro FROM favorites WHERE id=${data.id}`;
    const updateSQL = `UPDATE favorites SET title="${data.title}",link="${data.link}",intro="${data.intro}",updatetime=now() WHERE id=${data.id}`;
    connection.query(queryChangeSql, (err, results) => {
        console.log(results)
        const result = results[0];
        if (err) {
            res.send({
                status: 0,
                info: err.message
            });
        }
        if (data.title === result.title && data.link === result.link && data.intro === result.intro) {
            res.send({
                status: 0,
                info: '没有做任何改变！'
            });
            return false;
        }
           
        connection.query(updateSQL, (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    info: err.message
                });
            } else {
                res.send({
                    status: 1,
                    info: '修改成功！'
                });
            }
        });
    });
   
    
    
};

// 删除收藏
exports.delete = (req, res, next) => {
    
    // 接口验证登录是否有效
    if (!req.session.userInfo) {
        res.send({
            status: 2,
            info: '登录过期，请重新登录！'
        });
        return false;
    };

    const removeSql = `DELETE FROM favorites WHERE id=${req.body.id}`;
    connection.query(removeSql, (err, result) => {
       if (err) {
           res.send({
               status: 0,
               info: err.message
           });
       }
       res.send({
           status: 1,
           info: '删除成功！'
       })
    });
};
