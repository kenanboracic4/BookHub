var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User, Book, Cart, Order, OrderItem, UserGenres, Users, UserLanguages, GenresLK, LanguagesLK, BookConditionsLK, LocationsLK } = require('./models/associations');
const {setUserContext} = require('./middleware/auth');



var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setUserContext);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);


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

// database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Konekcija sa bazom je USPJEŠNA!');
  } catch (error) {
    console.error('❌ Nemoguće se povezati na bazu:', error);
  }
}

testConnection();

sequelize.sync(
  { alter: true }
).then(() => {
  console.log("Sve tabele su sinhronizovane sa bazom podataka.");
}).catch((error) => {
  console.error("Greška pri sinhronizaciji tabela:", error);
});

module.exports = app;
