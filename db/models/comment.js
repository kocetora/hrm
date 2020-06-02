'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const Form = require('./form');
const User = require('./user');

const Comment = sequelize.define('comment', {
  commentid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  comment: {
    type: Sequelize.STRING
  }
});

Form.hasMany(Comment, { as: 'comments' });
Comment.belongsTo(Form, {
  foreignKey: 'formid',
  as: 'form',
});

User.hasMany(Comment, { as: 'comments' });
Comment.belongsTo(User, {
  foreignKey: 'userid',
  as: 'user',
});

// https://bezkoder.com/sequelize-associate-one-to-many/

// sequelize.sync({force:true}).then(()=>{
//     console.log("Tables have been created");
//   }).catch(err=>console.log(err));

module.exports = Comment;
