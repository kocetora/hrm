'use strict';

const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

const findOneForm = () =>
  async ctx => {
    await Form.findOne({
      where: {
        formid: ctx.params.formid
      },
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
        ctx.status = 200;
        ctx.body = forms;
      })
      .catch(err => {
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          message: err
        };
      });
  };

module.exports = findOneForm;
