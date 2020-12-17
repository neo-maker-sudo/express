"use strict";

var express = require('express');

var path = require('path');

var rootDir = require('../util/path');

var router = express.Router();
var products = []; // /admin/add-product

router.get("/add-product", function (req, res, next) {
  // res.sendFile(path.join(rootDir,'views','add-product.html'));
  res.render('add-product', {
    pagetitle: 'Add Product',
    path: '/add-product'
  });
}); // /admin/product

router.post("/product", function (req, res, next) {
  console.log(req.body);
  products.push({
    title: req.body.title
  });
  res.redirect('/');
}); // module.exports = router;

exports.routes = router;
exports.products = products;