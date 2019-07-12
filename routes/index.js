const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const passport = require('passport');

const isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('message', 'Зарегистрируйтесь или войдите в профиль');
  res.redirect('/');
};

router.all('*', controllers.token);

router.post('/api/login', controllers.login);

router.post('/api/saveNewUser', controllers.registration);

router.get('/logout', controllers.logout);

module.exports = router;
