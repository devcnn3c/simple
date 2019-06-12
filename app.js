var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const simpleGit = require('simple-git/promise')();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const USER = 'devcnn3c';
const PASS = 'yrudumb123';
const REPO = 'git@github.com:devcnn3c/simple.git';


const git = require('simple-git/promise');


const remote = `${REPO}`;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/git/*', (req,res,next) => {
console.log('Git auth');
  git().silent(false).
      clone(remote, 'C:\\simple')
      .then(() => console.log('finished'))
      next()
      .catch((err) => console.error('failed: ', err));
 })
app.get('/git/init', (req,res) => {
  try {
    git()
        .add('./*')
        .commit("first commit!")
        .addRemote('origin', remote)
        .push('origin', 'master');

    /*simpleGit.init()
        .add('./*')
        .commit("first commit!")
        .addRemote('origin', remote)
        .push('origin', 'master');
  */
  }

  catch(err){
    console.log('ERRor:',err);
  }

})
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
