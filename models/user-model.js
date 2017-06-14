const sequelize = require('./index.js');
var Sequelize = require('sequelize');

const UserModel = sequelize.define('users', {
   uid: {
       type: Sequelize.INTEGER,
       primaryKey: true,
   },
   username: Sequelize.STRING,
   password: Sequelize.STRING,
   regtime: { type: Sequelize.DATE(6), defaultValue: Sequelize.NOW }
   
}, {
    timestamps: false,
});

module.exports = UserModel;
