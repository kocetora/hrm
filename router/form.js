'use strict';

const Router = require('koa-router');
const router = new Router();
const Form = require('../db/models/form');
const User = require('../db/models/user');
const Comment = require('../db/models/comment');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwtSecret = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

// получает форму по индексу
router.get('/api/form/:formid',
  passport.authenticate('jwt', { session: false }),
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
        ctx.body = forms;
      })
      .catch(err => {
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          message: err
        };
      });
  });

// фильтрует формы
router.post('/api/forms/filter', passport.authenticate('jwt', { session: false }),
  async ctx => {
    console.log(ctx.request.body);
    const body = ctx.request.body;
    await Form.findAll({
      where: {
        sex: body.sex,
        height: {
          [Op.gte]: body.height[0].from,
          [Op.lte]: body.height[0].to
        },
        born: {
          [Op.gte]: new Date(new Date() - body.age[0].to * (24 * 3600 * 365.25 * 1000)),
          [Op.lte]: new Date(new Date() - body.age[0].from * (24 * 3600 * 365.25 * 1000))
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
            languageProficiency: body.languageSkills[0].languageProficiency == 'any' ? ['native', 'fluent', 'intermediate', 'basic'] : body.languageSkills[0].languageProficiency
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
            ctx.body = forms;
          });
      }).catch(err => {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: err.message
        };
      });
  });

// удаляет форму
router.delete('/api/form/:formid', passport.authenticate('jwt', { session: false }),
  async ctx => {
    await Form.destroy({
      where: {
        formid: ctx.params.formid
      }
    })
      .then(() => {
        ctx.body = { status: 'Form Deleted!' };
      })
      .catch(err => {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: err.message
        };
      });
  });

// обновляет форму
router.put('/api/form/:formid', passport.authenticate('jwt', { session: false }),
  async ctx => {
    const formBody = { ...ctx.request.body };
    await Promise.all([
      Form.update(formBody,
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
  });

// создает комментарий
router.post('/api/form/:formid/comment', passport.authenticate('jwt', { session: false }),
  async ctx => {
    const body = { ...ctx.request.body };
    await Promise.all([
      Comment.create({
        formid: ctx.params.formid,
        comment: body.comment,
        userid: body.userid
      })
    ])
      .then(comment => {
        ctx.body = { success: true,
          message: comment };
      })
      .catch(err => {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: err.parent.detail || err.message
        };
      });
  });

//получает комментарии
router.get('/api/form/:formid/comment', passport.authenticate('jwt', { session: false }),
  async ctx => {
    await Promise.all([
      Comment.findAll({
        attributes: ['comment', 'createdAt', 'userid'],
        where: {
          formid: ctx.params.formid
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      })
    ])
      .then(comments => {
        ctx.body = comments[0];
      })
      .catch(err => {
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          message: err.message
        };
      });
  });

module.exports = router;
