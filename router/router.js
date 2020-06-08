'use strict';

const Router = require('koa-router');
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const createForm = require('./createForm');
// const updateForm = require('./updateForm');
const findAllForms = require('./findAllForms');
const passport = require('koa-passport');

module.exports = new Router()
  .post('/login', login())
  .post('/register', register())
  .get('/logout', logout())

  // .post('/form', createForm())
  // .put('/form/:formid', passport.authenticate('jwt', { session: false }), updateForm())
  .get('/forms/', passport.authenticate('jwt', { session: false }), findAllForms())