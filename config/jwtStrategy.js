const passport = require ('koa-passport');
const localStrategy = require ('passport-local').Strategy; 
const User = require ('../db/models/user'); 

const JWTstrategy = require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = require('../config/jwtConfig');

const bcrypt = require('bcrypt-nodejs');

module.exports = passport => {
passport.use( new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
},
    (username, password, done) => {
        console.log(username)
        try {
            console.log(username)
            console.log ('Local strategy')
            User.findOne({
                where: { username: username }                
            }) .then ( (user) => {
                if(!user) {
                        console.log('User does not exist');
                        return done (null, false, {message : 'User does not exist'});
                } else if (!user.validPassword(password)) {
                    console.log('Incorrect password');
                    return done (null, false, {message : 'User does not exist'});
                } else {
                    return done(null, user);
                }
                // if(!user) {
                //     console.log('User does not exist');
                //     return done (null, false, {message : 'User does not exist'});
                // } else {
                //     bcrypt.compare(password, user.password).then (responce => {
                //         if (responce !== true ) {
                //             console.log('Error with password validation');
                //             return done(null, false, {message:'Incorrect password'});
                //         }
                //         console.log ('User has logged')
                //         return done(null, user);
                //     })
                // }
                // console.log ('User has logged')
                // return done(null, user);
            })
        }
        catch (err) {
            console.log('Error with local strategy registration ' + err);
            done(err);
        }
    }
));

passport.serializeUser((user,cb) => {
    cb(null,user);
})

passport.deserializeUser((obj,cb) => {
    cb(null,obj);
})
}

const opt = {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:jwtSecret.secret 
};

passport.use ( 'jwt', new JWTstrategy (opt, (payload, done) => {
    models.User.findOne({
        where:{
            username:payload.id
        },
    }).then (user => {
        if (user) {
            console.log('User found');
            done(null,user);
        } else {
            console.log('User not found');
            done(null, false);
        }
    })
})
)