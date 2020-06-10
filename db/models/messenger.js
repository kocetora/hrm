'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const Form = require('./form');

const Messenger = sequelize.define('messenger', {
  messengerid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: { messengerid: 'messengerid is required' },
    },
  },
  messenger: {
    type: Sequelize.ENUM,
    values: [
      'Telegram',
      'Viber',
      'WhatsApp'],
    allowNull: false,
    validate: {
      notNull: { messenger: 'messenger is required' },
    },
  },
  info: {
    type: Sequelize.STRING,
  }
}, { timestamps: false });

const FormMessenger = sequelize.define('form_messenger', {},
  { timestamps: false });
Form.belongsToMany(Messenger, { through: FormMessenger });
Messenger.belongsToMany(Form, { through: FormMessenger });

// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created');
// }).catch(err => console.log(err));


module.exports = Messenger;

