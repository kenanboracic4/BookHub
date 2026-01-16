var createError = require('http-errors');
var express = require('express');
const http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User, Book, Cart, Order, OrderItem, UserGenres, Users, UserLanguages, GenresLK, LanguagesLK, BookConditionsLK, LocationsLK } = require('./models/associations');

// Middleware importi
const { setUserContext } = require('./middleware/auth');
const notificationsCount = require('./middleware/notifications');
const messageCount = require('./middleware/messages');
const lkdata = require('./middleware/lkdata');

// Router importi
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var notificationsRouter = require('./routes/notifications');
var chatRouter = require('./routes/chat');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// =========================================================================
// 🚀 OPTIMIZACIJA PERFORMANSI
// Statički fajlovi (slike, CSS, JS) idu PRVI.
// Ovako server ne pita bazu podataka kada treba samo da dohvati sliku.
// =========================================================================
app.use(express.static(path.join(__dirname, 'public')));

// Standardni Express parseri
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Custom Middleware (vezan za Bazu Podataka)
// Ovo se izvršava SAMO ako zahtjev nije bio za statički fajl (sliku/css)
app.use(setUserContext);
app.use(lkdata);
app.use(notificationsCount);
app.use(messageCount);

// Definisanje Ruta
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/notifications', notificationsRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

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

/*
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Sve tabele su sinhronizovane sa bazom podataka.");
  })
  .catch((error) => {
    console.error("Greška pri sinhronizaciji tabela:", error);
  });
*/
module.exports = app;