"use strict";

var express = require('express');

var path = require('path');

var rootDir = require('../util/path');

var admindata = require('./admin');

var router = express.Router();
router.get("/", function (req, res, next) {
  // console.log(admindata.products);
  // res.sendFile(path.join(rootDir,'views','shop.html'));
  var product = admindata.products;
  res.render('shop', {
    prods: product,
    pagetitle: 'Shop',
    path: '/'
  });
});
module.exports = router;