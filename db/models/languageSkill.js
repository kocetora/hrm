'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const Form = require('./form');

const LanguageSkill = sequelize.define('languageSkill', {
  languageid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: { languageid: 'languageid is required' },
    },
  },
  language: {
    type: Sequelize.ENUM,
    values: [
      'english',
      'russian'],
    allowNull: false,
    validate: {
      notNull: { language: 'language is required' },
    },
  },
  languageProficiency: {
    type: Sequelize.ENUM,
    values: [
      'native',
      'fluent',
      'intermediate',
      'basic'],
    allowNull: false,
    validate: {
      notNull: { languageid: 'languageid is required' },
    },
  }
}, { timestamps: false });

const FormLanguageSkill = sequelize.define('form_languageSkill', {},
  { timestamps: false });
Form.belongsToMany(LanguageSkill, { through: FormLanguageSkill });
LanguageSkill.belongsToMany(Form, { through: FormLanguageSkill });

// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created');
// }).catch(err => console.log(err));

module.exports = LanguageSkill;
