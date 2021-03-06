var express =       require('express');
var path =          require('path');
var favicon =       require('serve-favicon');
var logger =        require('morgan');
var cookieParser =  require('cookie-parser');
var bodyParser =    require('body-parser');

var index =           require('./routes/index');
var users =           require('./routes/users');
var web_api =         require('./routes/w_api');
var pop_over =        require('./routes/pop_over');
var student_sign_up = require('./routes/student_sign_up');
var main_hub =        require('./routes/main_hub');
var projects_page =   require('./routes/projects.js');
var join_group =      require('./routes/join_group');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'foobar.jpg')));// TODO get the fudging icon you dumb!
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', web_api);
app.use('/pop_over', pop_over);
app.use('/student_sign_up',student_sign_up);
app.use('/main_hub',main_hub);
app.use('/projects', projects_page);
app.use('/join_group', join_group);

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