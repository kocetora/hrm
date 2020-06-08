'use strict';

const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

const findAllForms = () => 
  async ctx => {
    await Form.findAll({
      include: [
        {
          model: Profession,
          through: {
            attributes: []
          }
        },
        {
          model: Messenger,
          through: {
            attributes: []
          }
        },
        {
          model: LanguageSkill,
          through: {
            attributes: []
          }
        },
      ]
    })
      .then(forms => {
        ctx.body = forms;
      })
      .catch(err => {
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          message: err.message
        };
      });
  };

module.exports = findAllForms;