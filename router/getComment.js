'use strict';

const User = require('../db/models/user');
const Comment = require('../db/models/comment');

const getComment = () =>
  async (ctx, next) => {
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
        ctx.status = 200;
        ctx.body = comments[0];
        return next();
      })
      .catch(err => {
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          message: err.message
        };
        return next();
      });
  };

module.exports = getComment;
