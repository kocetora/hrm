'use strict';

const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

const updateForm = () =>
  async ctx => {
    const body = { ...ctx.request.body };
    await Promise.all([
      Form.update(body,
        { where: { formid: ctx.params.formid } })
    ])
      .then(async forms => {
        await Form.findAll({
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
          .then(form => {
              console.log(form);
            ctx.body = form;
          });
      }).catch(err => {
        console.log(err);
        ctx.status = 400;
        ctx.body =  {
          success: false,
          message: err.message
        };
      });
  };

module.exports = updateForm; 