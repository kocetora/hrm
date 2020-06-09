'use strict';

const Comment = require('../db/models/comment');

const postComment = () =>
  async (ctx, next) => {
    const body = { ...ctx.request.body };
    await Promise.all([
      Comment.create({
        formid: ctx.params.formid,
        comment: body.comment,
        userid: body.userid
      })
    ])
      .then(comment => {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: comment
        };
        return next();
      })
      .catch(err => {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: err.message
        };
        return next();
      });
  };

module.exports = postComment;
