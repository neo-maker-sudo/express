"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var path = require('path'); // const handleBar = require('express-handlebars');


var adminRouter = require('./routes/admin');

var shopRouter = require('./routes/shop');

var app = express(); // app.engine('hbs',handleBar());
// app.set('view engine','hbs');
// app.set('view engine','ejs');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/admin', adminRouter.routes);
app.use(shopRouter);
app.use(function (req, res, next) {
  // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
  res.status(404).render('404', {
    pagetitle: '404 page',
    path: ''
  });
});
app.listen(3000);