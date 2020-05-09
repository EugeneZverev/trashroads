var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');	//роутер для главной страницы проекта
var usersRouter = require('./routes/users');	//роутер непонятно для чего (пока оставить до реализации функции регистрации)
var loginRouter = require('./routes/login');	//роутер для страницы логина (нормальная, оставить до реализации функции регистрации)
var signupRouter = require('./routes/signup');	//роутер для страницы регистрации (нормальная, оставить до реализации функции регистрации)
var databaseGetRouter = require('./routes/databaseGet');	//роутер для получения данных из базы SQLite (удалить после создания базы Postgres)
var databaseSendRouter = require('./routes/databaseSend');	//роутер для отправки данных в базу SQLite (удалить после создания базы Postgres)
var dbpRouter = require('./routes/pg_database');			//старый роутер для получения данных из Postgres (заменить на новый)
var editMapRouter = require('./routes/edit');	//роутер для страницы редактирования данных
var getOSMDataFromServerRouter = require('./routes/getOSMDataFromServer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/db/getdata', databaseGetRouter);
app.use('/getpgdata', dbpRouter);
app.use('/edit', editMapRouter);
app.use('/db/senddata', databaseSendRouter);
app.use('/get_osm_data', getOSMDataFromServerRouter);

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