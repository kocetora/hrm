'use strict';
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const passport = require ('koa-passport');
// const jwtSecret = require('./config/jwtConfig.js');
//const uuid = require('uuid');
// const tokenGenerator = require('uuid-token-generator');
const jwt = require ('koa-jwt');
const cors = require('@koa/cors');

app.use(cors());

const forms = require('./router/form');

app.use(bodyParser());
app.use(forms.allowedMethods());
app.use(passport.initialize());
app.use(passport.session());
require('./config/jwtStrategy')(passport);
app.use(forms.routes());

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
