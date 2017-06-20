
// 访问首页
exports.index = (req, res, next) => {
    res.render('index.html',{
        title: 'fam管理工具',
        name: '收藏夹'
    });
}
    

