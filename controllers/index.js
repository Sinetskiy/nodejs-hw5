const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuidv4 = require('uuid/v4');

module.exports.token = (req, res, next) => {
    const token = req.cookies.token;
    if (!!token) {
        User.findOne({token}).then(user => {
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

module.exports.index = (req, res, next) => {
    res.render('pages/index', {
        title: 'My passport',
        user: req.user,
        message: req.flash('message'),
    });
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
            const {username, firstName, middleName, surName, permission, hash} = user._doc;
            const  userDto = {username, firstName, middleName, surName, permission, id: hash, access_token: hash, image: ""};
            if (req.body.remember) {
                const token = uuidv4();
                user.setToken(token);
                user.save().then(user => {
                    res.cookie('token', token, {
                        maxAge: 7 * 60 * 60 * 1000,
                        path: '/',
                        httpOnly: true,
                    });
                    res.json(userDto);
                });
            } else {
                res.json(userDto);
            }
        });
    })(req, res, next);
};

module.exports.registration = (req, res, next) => {

    console.log(req.body);

    const {username, firstName, middleName, surName, password, permission} = req.body;
    User.findOne({username}).then(user => {
        if (user) {
            req.flash('message', 'Пользователь с таким логином уже существует');
            res.redirect('/');
        } else {
            const newUser = new User();
            newUser.username = username;
            newUser.firstName = firstName;
            newUser.middleName = middleName;
            newUser.surName = surName;
            newUser.permission = permission;
            newUser.setPassword(password);
            newUser
                .save()
                .then(user => {
                    req.logIn(user, err => {
                        if (err) next(err);
                        req.flash('message', 'User create');
                        res.json(user._doc);
                    });
                })
                .catch(next);
        }
    });
};

module.exports.profile = function (req, res) {
    res.render('pages/profile', {
        user: req.user,
        message: req.flash('message'),
    });
};

module.exports.logout = async (req, res) => {
    await req.logout();
    res.clearCookie('token');
    req.flash('message', 'User logout');
    res.redirect('/registration');
};

module.exports.git = function (req, res) {
    res.redirect('/profile');
};
