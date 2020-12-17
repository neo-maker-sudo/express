"use strict";

var express = require('express');

var app = express();
var port = process.env.PORT || 3000; // ---- ROUTES ----
// 舊方法

app.get('/sample', function (req, res) {
  res.send('this is a sample!');
}); // Express Router
// 建立 Router 物件

var router = express(); // 首頁路由 (http://localhost:8080)

router.get('/', function (req, res) {
  res.send('home page!');
}); // 另一張網頁路由 (http://localhost:8080/about)

router.get('/about', function (req, res) {
  res.send('about page!');
}); // // 將路由套用至應用程式
// app.use('/',router);
// ---- 啟動伺服器 ----

router.listen(port);