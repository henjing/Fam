const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const cookieSession = require('cookie-session');

const routes = require('./routes/index');

let isProduction = process.env.NODE_ENV === 'production';

const app = express();

// view engine setup
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    noCache: false
});
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


if (isProduction === false) {
    console.log('当前处于开发环境')
    app.use('/public', express.static(path.join(__dirname, 'public')));
}

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['famfamenjing'],
    maxAge: 30 * 60 * 1000
}));

routes(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;