'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../db.js');
const bcrypt = require('bcrypt-nodejs');

const User = sequelize.define('users', {
  userid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: { userid: 'userid is required' },
    },
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: { username: 'username is required' },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { password: 'password is required' },
    },
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

// sequelize.sync({ force: true }).then(() => {
//   console.log('Tables have been created');
// }).catch(err => console.log(err));

module.exports = User;
