'use strict';

const Sequelize = require('sequelize')
const sequelize = new Sequelize('form-manager', 'postgres', '30918', {
  host: 'localhost',
  dialect: 'postgres',
  port: "5432",
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize
