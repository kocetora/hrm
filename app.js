'use strict';
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-body');


const forms = require('./router/form');

app.use(bodyParser());
app.use(forms.routes());

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
