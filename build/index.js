'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nunjucks = require('nunjucks'),
    path = require('path'),
    app = (0, _express2.default)(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

app.set('assets_path', process.env.NODE_ENV === 'production' ? '/' : '/');
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));
app.set('templates', path.join(__dirname, app.get('assets_path') + '/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(_express2.default.static(path.join(__dirname, app.get('assets_path'))));

var routes = require('./routes/index'),
    api_routes = require('./routes/api');

app.set('port', process.env.PORT || 8000);

nunjucks.configure(app.get('templates'), {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

app.use('/', routes);
app.use('/api/', api_routes);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// WARNING: Remove this in production else server data will leak to the client
/*
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404.html');
});
*/

app.listen(app.get('port'), function () {
    console.log('Server started on port', app.get('port'));
});

module.exports = app;