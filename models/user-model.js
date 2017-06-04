const sequelize = require('./index.js');
var Sequelize = require('sequelize');

const UserModel = sequelize.define('users', {
   uid: {
       type: Sequelize.STRING(),
       primaryKey: true,
   },
   username: Sequelize.STRING(),
   password: Sequelize.STRING(),
   
}, {
    timestamps: false
});

module.exports = UserModel;
