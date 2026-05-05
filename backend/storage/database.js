const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});
module.exports = sequelize;