'use strict';

const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = require('../config/jwtConfig');

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  (username, password, done) => {
    try {
      User.findOne({
        where: { username }
      }).then(user => {
        if (!user || !user.validPassword(password)) {
          return done(null, false,
            { message: 'User does not exist or password is incorrect' });
        } else {
          return done(null, user);
        }
      });
    } catch (err) {
      done(err);
    }
  }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};

const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret.secret
};

passport.use('jwt', new JWTstrategy(opt, (payload, done) => {
  User.findOne({
    where: {
      userid: payload.userid,
      username: payload.username
    }
  }).then(user => {
    if (user) {
      done(null, user);
    } else {
      done(null, false, { message: 'Unauthorized' });
    }
  });
}));
