require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import the allowCors middleware

const allowCors = require("./allowCors");

// Define your route handler
const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

// Activate allowCors middleware for your handler
const corsHandler = allowCors(handler);

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected to database')
}

//ROUTER
var indexRouter = require("./routes/index");
var catalogRouter = require('./routes/catalog');
var imageRouter = require("./routes/image");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCors)

app.use('/', indexRouter)
app.use('/', catalogRouter);
app.use('/api/image', imageRouter)



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
