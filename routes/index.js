const Index = require('../controllers/indexController');
const Users = require('../controllers/userController');
const Favorite = require('../controllers/favoriteController');

const router = (app) => {
    app.get('/', Index.index);
    app.get('/index.html', Index.index);
    
    app.get('/login.html', Users.index);
    app.post('/api/login', Users.login);
    app.post('/api/register', Users.register);
    
    app.get('/favorite.html', Favorite.index);
    app.post('/api/favorite/add', Favorite.add);
    app.post('/api/favorite/edit', Favorite.edit);
    app.post('/api/favorite/delete', Favorite.delete);
    app.get('/api/favorite/category', Favorite.getCategory);
    app.post('/api/favorite/category/add', Favorite.addCategory);
    app.post('/api/favorite/category/delete', Favorite.deleteCategory);
}

module.exports = router;

