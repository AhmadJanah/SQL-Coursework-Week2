var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'Ahmed',
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: '123',
  port: 5432
});

app.get("/customers", function (req, res) {
  pool.query('SELECT * FROM customers', (error, result) => {
    res.json(result.rows);
  });
});

app.get("/suppliers", function (req, res) {
  pool.query('SELECT * FROM suppliers', (error, result) => {
    res.json(result.rows);
  });
});

app.get("/products", function (req, res) {
  pool.query('SELECT product_name, unit_price, supplier_name FROM products pr, product_availability pa, suppliers su WHERE pr.id = pa.prod_id AND pa.supp_id = su.id', 
            (error, result) => {
    res.json(result.rows);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

module.exports = app;
