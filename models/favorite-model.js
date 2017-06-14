const sequelize = require('./index.js');
var Sequelize = require('sequelize');
var UserModel = require('./user-model.js');

const FavoriteModel = sequelize.define('favorite', {
   id: {
       type: Sequelize.INTEGER,
       primaryKey: true,
   },
   uid: {
       type: Sequelize.INTEGER,
       referances: {
           model: UserModel,
           key: 'uid',
       }
   },
   title: Sequelize.STRING,
   link: Sequelize.STRING,
   intro: Sequelize.STRING,
   addtime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
   updatetime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
   
}, {
    timestamps: false
});

module.exports = FavoriteModel;
