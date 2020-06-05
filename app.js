'use strict';
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const cors = require('@koa/cors');
const PORT = 3000;

app.use(cors());

const forms = require('./router/form');

app.use(bodyParser());
app.use(forms.allowedMethods());
app.use(passport.initialize());
app.use(passport.session());
require('./config/jwtStrategy')(passport);
app.use(forms.routes());
app.use(forms.allowedMethods());

app.listen(PORT, () => {
  console.log('Server running at port ' + PORT);
});

module.exports = app;
