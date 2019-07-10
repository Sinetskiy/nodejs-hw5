let createError = require('http-errors');
let express = require('express');
let path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();
const bodyParser = require('body-parser');

require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('./config/config-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'text/plain'}));

app.use(
    session({
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        secret: 'key-secret',
        key: 'session-key',
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
        },
        saveUninitialized: false,
        resave: true,
        ephemeral: true,
        rolling: true,
    })
);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
