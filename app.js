require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index_routes');
var usersRouter = require('./routes/users_routes');
var productsRouter = require('./routes/products_routes');
var cartsRouter = require('./routes/carts_routes');
var cartRouter = require('./routes/cart_routes');
const authenticate = require('./middlewares/authenticate');
const authorize = require('./middlewares/authorize');
const setCart = require('./middlewares/setCart');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', authenticate, authorize, cartsRouter);
app.use('/cart', authenticate, setCart, cartRouter);

module.exports = app;
