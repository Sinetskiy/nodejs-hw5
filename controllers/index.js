const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuidv4 = require('uuid/v4');

const getUserObject = (user) => {
    return {username, firstName, middleName, surName, permission, access_token} = user;
};

module.exports.token = (req, res, next) => {
    const access_token = req.cookies.token;
    console.log('access_token', access_token);
    if (!!access_token) {
        User.findOne({access_token}).then(user => {
            if (user) {
                req.logIn(user, err => {
                    if (err) next(err);
                });
            }
            next();
        });
    } else {
        next();
    }
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
                const token = uuidv4();
                user.setToken(token);
                user.save().then(user => {
                    res.cookie('token', token, {
                        maxAge: 7 * 60 * 60 * 1000,
                        path: '/',
                        httpOnly: true,
                    });
                    console.log('token', token);
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
            const token = uuidv4();
            newUser.setToken(token);
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

