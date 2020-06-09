'use strict';

const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const filterForms = () =>
  async ctx => {
    const body = ctx.request.body;
    await Form.findAll({
      where: {
        sex: body.sex,
        height: {
          [Op.gte]: body.height[0].from,
          [Op.lte]: body.height[0].to
        },
        born: {
          [Op.gte]: new Date(new Date() -
                             body.age[0].to *
                             (24 * 3600 * 365.25 * 1000)),
          [Op.lte]: new Date(new Date() -
                             body.age[0].from *
                             (24 * 3600 * 365.25 * 1000))
        },
        workExperience: {
          [Op.gte]: body.workExperience[0].from,
          [Op.lte]: body.workExperience[0].to
        },
        expectedSalary: {
          [Op.gte]: body.expectedSalary[0].from,
          [Op.lte]: body.expectedSalary[0].to
        },
        education: body.education
      },
      include: [
        {
          model: Profession,
          where: {
            profession: body.professions.map(element => element.profession)
          },
          through: {
            attributes: []
          }
        },
        {
          model: Messenger,
          where: {
            messenger: body.messengers.map(element => element.messenger)
          },
          through: {
            attributes: []
          }
        },
        {
          model: LanguageSkill,
          where: {
            language: body.languageSkills[0].language,
            languageProficiency:
              body.languageSkills[0].languageProficiency === 'any' ?
                ['native', 'fluent', 'intermediate', 'basic'] :
                body.languageSkills[0].languageProficiency
          },
          through: {
            attributes: []
          }
        },
      ]
    })
      .then(async forms => {
        await Form.findAll({
          where: {
            formid: forms.map(form => form.formid)
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
          });
      }).catch(err => {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: err.message
        };
      });
  };

module.exports = filterForms;
