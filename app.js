var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;
var dbs;
MongoClient.connect("mongodb://localhost:27017/",function(err,db){
  if(err) console.log("Database Connection Error");
  dbs = db.db('Marker');
  console.log("Database Connected");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const masterPassword = "test";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/',function(req,res){
  res.render('index');
})

app.get('/home',function(req,res){
  res.render('home')
})

app.get('/addTeacher',function(req,res){
  res.render('teacher')
})

app.get('/addStudent',function(req,res){
  res.render('student')
})


app.post('/login',function(req,res){
  if(req.body.pass == masterPassword){
    res.redirect('/home');
  }
  else{
    res.send("Wrong Password");
  }
})

app.post('/addTeacher',function(req,res,next){
  var obj = { name: req.body.name, e_id: req.body.e_id, sub_id: req.body.sub_id, pass: req.body.e_id  }
  dbs.collection('teachers').insertOne(obj, function(r,e){
    if(e) next(e)
    res.redirect('/addTeacher')
  })
})

app.post('/addStudent',function(req,res,next){
  var obj = { name: req.body.name, usn: req.body.usn, class: req.body.class, pass: req.body.usn  }
  dbs.collection('students').insertOne(obj, function(r,e){
    if(e) next(e)
    res.redirect('/addStudent')
  })
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
