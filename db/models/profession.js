'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const Form = require('./form');

const Profession = sequelize.define('profession', {
  professionid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  profession: {
    type: Sequelize.ENUM,
    values: [
      'trainee',
      'dealer',
      'inspector',
      'manager',
      'pit_boss',
      'waiter',
      'barman']
  }
}, { timestamps: false });

const FormProfession = sequelize.define('form_profession', {},
  { timestamps: false });
Form.belongsToMany(Profession, { through: FormProfession });
Profession.belongsToMany(Form, { through: FormProfession });

// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created');
// }).catch(err => console.log(err));

module.exports = Profession;

