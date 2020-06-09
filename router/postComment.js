'use strict';

const Comment = require('../db/models/comment');

const postComment = () =>
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
  };

module.exports = postComment;
