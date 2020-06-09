'use strict';

const Router = require('koa-router');
const router = new Router();
const Form = require('../db/models/form');
const User = require('../db/models/user');
const Comment = require('../db/models/comment');
const passport = require('koa-passport');

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
