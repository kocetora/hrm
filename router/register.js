'use strict';
const User = require('../db/models/user');

const register = () => async (ctx, next) => {
  const body = ctx.request.body;
  await Promise.all([
    User.create(body)
  ])
    .then(() => {
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: 'User created!'
      };
      return next();
    })
    .catch(err => {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.parent.detail
      };
      return next();
    });
};

module.exports = register;
