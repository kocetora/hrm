'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../db.js');

const Form = sequelize.define('form', {
  formid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: { formid: 'formid is required' },
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { firstname: 'firstname is required' },
    },
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { surname: 'secondname is required' },
    },
  },
  sex: {
    type: Sequelize.ENUM,
    values: ['male', 'female'],
    allowNull: false,
    validate: {
      notNull: { sex: 'sex is required' },
    },
  },
  born: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { born: 'born is required' },
    },
  },
  height: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: { height: 'height is required' },
    },
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { phoneNumber: 'phone is required' },
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { email: 'email is required' },
    },
  },
  education: {
    type: Sequelize.ENUM,
    values: [
      'primary',
      'secondary',
      'unfinished_higher',
      'higher'],
    allowNull: false,
    validate: {
      notNull: { education: 'education is required' },
    },
  },
  expectedSalary: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: { expectedSalary: 'salary is required' },
    },
  },
  prefferedRegion: {
    type: Sequelize.STRING,
  },
  workExperience: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: { workExperience: 'experience is required' },
    },
  },
  unemployedFor: {
    type: Sequelize.INTEGER
  },
  note: {
    type: Sequelize.TEXT
  },
}, { timestamps: false });

// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created');
// }).catch(err => console.log(err));

module.exports = Form;

