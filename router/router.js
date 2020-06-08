'use strict';

const Router = require('koa-router');
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const createForm = require('./createForm');

module.exports = new Router()
  .post('/login', login())
  .post('/register', register())
  .get('/logout', logout())

  .post('/form', createForm());
// .put('/form', updateForm())
