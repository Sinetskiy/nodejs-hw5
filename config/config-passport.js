const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
require('../db/models/user');
const User = mongoose.model('User');
const secret = require('./config.json').secret;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.serializeUser(function (user, done) {
    user.id = user._id;
   // console.log('Serialize: ', user);
    done(null, user);
});

passport.deserializeUser(function (id, done) {
  //  console.log('Deserialize: ', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        done(null, id);
    } else {
        User.findById(id, (err, user) => {
            if (err) {
                return done(err);
            }
        //    console.log(user);
            done(null, user);
        });
    }
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            User.findOne({username})
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash('message', 'User not found'));
                    }
                    if (!user.validPassword(password)) {
                        return done(
                            null,
                            false,
                            req.flash('message', 'Incorrect password')
                        );
                    }
                    return done(null, user);
                })
                .catch(err => {
                        done(err);
                    }
                );
        }
    )
);

passport.use(
    new Strategy(params, function(payload, done) {
        console.log(payload);
        User.find({ id: payload.id })
            .then(user => {
                if (!user) {
                    return done(new Error('User not found'));
                }
                return done(null, { id: user.id });
            })
            .catch(err => done(err));
    })
);

