var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const gitP = require('simple-git/promise');
const git = gitP(__dirname);
const remote = `https://github.com/devcnn3c/simple.git`;

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
app.get('/git/init', (req,res,next) => {
console.log('Git auth');
  git.checkIsRepo()
      .then(isRepo => console.log('ISREPO:',isRepo) && !isRepo && initialiseRepo(git))
      .then(() => git.fetch());
  initialiseRepo(git);
  function initialiseRepo (git) {
    console.log('initialize');
    return git.init()
        .then(() => git.addRemote('origin', 'https://github.com/devcnn3c/simple.git'))
  }
 })

app.get('/git/add', (req,res) => {
git.add('./*').then(result=>{console.log('add:', result)
res.status(200).send('Added')});
});

app.get('/git/branch', (req,res)=>{
  git.branch([]).then(result=>{console.log(result); res.status(200).send({'Current Branch':  result})})
})

app.post('/git/commit',async (req,res)=>{
  let ans = await git.commit(req.body.message);
  console.log('Commit message:', ans);
})


app.post('/git/push',async (req,res)=>{
  let ans = await git.push('origin', 'master');
})


app.get('/git/pull', (req,res) => {


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
