'use strict';
  
var Koa = require('koa')
var app = new Koa()
const bodyParser = require('koa-body')

const tasks = require('./router/form')

app.use(bodyParser())
app.use(tasks.routes())

app.listen(3000, () => {
  console.log('Server running at port 3000')
})
