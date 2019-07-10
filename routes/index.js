const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

const isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('message', 'Зарегистрируйтесь или войдите в профиль');
  res.redirect('/');
};

router.all('*', controllers.token);

router.get('/', controllers.index);

router.post('/api/login', controllers.login);

router.get('/profile', isAuthenticated, controllers.profile);

router.post('/api/saveNewUser', controllers.registration);

router.get('/logout', controllers.logout);


module.exports = router;
