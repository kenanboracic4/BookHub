var createError = require('http-errors');
var express = require('express');
const http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');



const { setUserContext } = require('./middleware/auth');
const notificationsCount = require('./middleware/notifications');
const messageCount = require('./middleware/messages');
const lkdata = require('./middleware/lkdata');


var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var notificationsRouter = require('./routes/notifications');
var chatRouter = require('./routes/chat');
var adminRouter = require('./routes/admin');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(setUserContext);
app.use(lkdata);
app.use(notificationsCount);
app.use(messageCount);


app.get("/pingdb", async (req, res) => {
  const t0 = Date.now();
  await sequelize.query("SELECT 1");
  res.json({ ms: Date.now() - t0 });
});

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/notifications', notificationsRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

 
  res.status(err.status || 500);
  res.render('error');
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(' Konekcija sa bazom je USPJEŠNA!');
  } catch (error) {
    console.error('Nemoguće se povezati na bazu:', error);
  }
}

testConnection();


sequelize.sync({ alter: true })
  .then(() => {
    console.log("Sve tabele su sinhronizovane sa bazom podataka.");
  })
  .catch((error) => {
    console.error("Greška pri sinhronizaciji tabela:", error);
  });
  
module.exports = app;