const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.post('/api/authFromToken', controllers.token);

//router.all('*', controllers.jwtToken);

router.post('/api/login', controllers.login);

router.post('/api/saveNewUser', controllers.registration);

router.get('/logout', controllers.logout);

module.exports = router;
