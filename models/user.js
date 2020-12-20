const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('user',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false
    }
});

module.exports = Users;