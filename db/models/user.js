'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const bcrypt = require('bcrypt-nodejs');

const User = sequelize.define('users', {
  userid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  login: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}
);

User.beforeCreate(user => cryptPassword(user.password)
  .then(success => {
    user.password = success;
  })
  .catch(err => {
    if (err) console.log(err);
  }));

function cryptPassword(password) {
  console.log('cryptPassword' + password);
  return new Promise(((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      // Encrypt password using bycrpt module
      if (err) return reject(err);

      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  }));
}

User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.dataValues.password);
};

// https://gist.github.com/JesusMurF/9d206738aa54131a6e7ac88ab2d9084e

// sequelize.sync({force:true}).then(()=>{
//     console.log("Tables have been created");
//   }).catch(err=>console.log(err));

module.exports = User;
