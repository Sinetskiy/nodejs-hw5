const jwt = require('jsonwebtoken');
const passport = require('passport');
const secret = require('../config/config.json').secret;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuidv4 = require('uuid/v4');

const getUserObject = (user) => {
    const {_id, username, firstName, middleName, surName, permission, access_token} = user;
    return {id:_id, username, firstName, middleName, surName, permission, access_token};
};

module.exports.token = (req, res, next) => {
    const access_token = req.cookies.access_token;
    console.log('access_token', access_token);
    if (!!access_token) {
        User.findOne({access_token}).then(user => {
            if (user) {
                req.logIn(user, err => {
                    if (err) next(err);
                    console.log('user', user);
                    res.json(getUserObject(user));
                });
            }
            next();
        });
    } else {
        next();
    }
};

module.exports.jwtToken = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                err: true,
                message: 'Укажите правильный логин и пароль',
            });
        }
        if (user) {
            const payload = {
                id: user.id,
            };
            const token = jwt.sign(payload, secret);
            res.json({ err: false, token: token });
        }
    })(req, res, next);
};

module.exports.login = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            if (req.body.remembered) {
                user.access_token = uuidv4();
                user.save().then(user => {
                    res.cookie('access_token', user.access_token, {
                        maxAge: 7 * 60 * 60 * 1000,
                        path: '/',
                        httpOnly: true,
                    });
                    res.json(getUserObject(user));
                });
            } else {
                res.json(getUserObject(user));
            }
        });
    })(req, res, next);
};

module.exports.registration = (req, res, next) => {
    const {username, firstName, middleName, surName, password, permission} = req.body;
    console.log(req.body);
    User.findOne({username}).then(user => {
        if (user) {
            req.flash('message', 'Пользователь с таким логином уже существует');
            res.redirect('/');
        } else {
            const newUser = new User();
            newUser.username = username;
            newUser.setPassword(password);
            newUser.firstName = firstName;
            newUser.middleName = middleName;
            newUser.surName = surName;
            newUser.permission = permission;
            newUser.access_token = uuidv4();
            newUser
                .save()
                .then(user => {
                    req.logIn(user, err => {
                        if (err) next(err);
                        req.flash('message', 'User create');
                        res.json(getUserObject(user));
                    });
                })
                .catch(next);
        }
    });
};


module.exports.logout = async (req, res) => {
    await req.logout();
    res.clearCookie('token');
    req.flash('message', 'User logout');
    res.redirect('/');
};

