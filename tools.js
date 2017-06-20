/* 常用方法 */

/*
 * 检查用户是否已经登录
 * 
 * @param {object} req
 * @param {object} res
 * @return {boolean} 
 */
exports.checkLogin = function (req,res) {
    if (!req.session.userInfo) {
        res.redirect('/login.html');
    } else {
        return true;
    }
}

/*
 * 分页，计算总页数
 * 
 * @param {number} items 总条数
 * @param {number} limit 每页多少条
 * @return {number} 返回总页数
 */
exports.getPages = function (items, limit) {
    let pages = items/limit;
    if (pages <= 1) {
        return 1;
    } else if (pages > 1 && items%limit === 0) {
        return pages;
    } else if (pages > 1 && items%limit !== 0) {
        return parseInt(pages) + 1;
    }
}

/*
 * 把数值转换成数组
 * 
 * @param {number} num
 * @return {array} 
 */
exports.numberChangeToArray = function (num) {
    let arr = [];
    for (let i = 1; i <= num; i++) {
        arr.push(i);
    }
    return arr;
}