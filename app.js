var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexPageRouter = require('./routes/indexPage');	//роутер для главной страницы проекта
var editPageRouter = require('./routes/editPage');		//роутер для страницы редактирования данных
var loginPageRouter = require('./routes/loginPage');	//роутер для страницы логина (нормальная, оставить до реализации функции регистрации)
var signupPageRouter = require('./routes/signupPage');	//роутер для страницы регистрации (нормальная, оставить до реализации функции регистрации)
//var usersPageRouter = require('./routes/usersPage');	//роутер непонятно для чего (пока оставить до реализации функции регистрации)
var getRoutesFromServerRouter = require('./routes/getRoutesFromServer');	//роутер для получения данных от сервера
var sendRoutesToServerRouter = require('./routes/sendRoutesToServer');		//роутер для отправки данных в базу Postgres таблицу fake_routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexPageRouter);
app.use('/edit', editPageRouter);
app.use('/login', loginPageRouter);
app.use('/signup', signupPageRouter);
//app.use('/users', usersPageRouter);
app.use('/db/get_routes', getRoutesFromServerRouter);
app.use('/db/send_routes', sendRoutesToServerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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