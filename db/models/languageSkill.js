const Sequelize = require('sequelize')
const sequelize = require('../db.js')
const Form = require('../form');

const LanguageSkill = sequelize.define('languageSkill', {
    languageid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    language: {
        type: Sequelize.ENUM,
        values: [
            'english',
            'russian']
    },
    languageProficiency: {
        type: Sequelize.ENUM,
        values: [
            'native', 
            'fluent', 
            'intermediate', 
            'basic',
            'none'],
    }
}, { timestamps: false });

const Form_LanguageSkill = sequelize.define('Form_LanguageSkill', {}, { timestamps: false });
Form.belongsToMany(LanguageSkill, { through: Form_LanguageSkill });
LanguageSkill.belongsToMany(Form, { through: Form_LanguageSkill });

module.exports = LanguageSkill;