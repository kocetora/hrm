'use strict';

const Form = require('../db/models/form');

const deleteForm = () =>
  async (ctx, next) => {
    await Form.destroy({
      where: {
        formid: ctx.params.formid
      }
    })
      .then(() => {
        ctx.status = 200;
        ctx.body = {
          status: true,
          message: 'Form Deleted!'
        };
        return next();
      })
      .catch(err => {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: err.message
        };
        return next();
      });
  };

module.exports = deleteForm;
