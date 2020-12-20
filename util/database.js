const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','root','hap62712',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;