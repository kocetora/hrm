'use strict';

const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

const createForm = () =>
  async (ctx, next) => {
    const body = { ...ctx.request.body };
    await Promise.all([
      Form.create(body),
      Profession.bulkCreate(body['professions']),
      LanguageSkill.bulkCreate(body['languageSkills']),
      Messenger.bulkCreate(body['messengers'])
    ])
      .then(([form, professions, languageSkills, messengers]) => {
        form.addProfessions(professions);
        form.addMessengers(messengers);
        form.addLanguageSkills(languageSkills);
        return [form, professions, languageSkills, messengers];
      })
      .then(() => {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: 'Form added!'
        };
        return next();
      })
      .catch(err => {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: err.errors ? err.errors.map(el => el.message) : err.message
        };
        return next();
      });
  };

module.exports = createForm;
