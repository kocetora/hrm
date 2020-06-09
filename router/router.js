'use strict';

const Router = require('koa-router');
// const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const createForm = require('./createForm');
const updateForm = require('./updateForm');
const findAllForms = require('./findAllForms');
const findOneForm = require('./findOneForm');
const filterForms = require('./filterForms');
const passport = require('koa-passport');

module.exports = new Router()
  // .post('/login', login())
  .post('/register', register())
  .get('/logout', logout())

  .post('/form', createForm())
  .put('/form/:formid', passport.authenticate('jwt', { session: false }),
    updateForm())
  .get('/form/:formid', passport.authenticate('jwt', { session: false }),
    findOneForm())

  .get('/forms', passport.authenticate('jwt', { session: false }),
    findAllForms())
  .post('/forms', passport.authenticate('jwt', { session: false }),
    filterForms());

