const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product
router.get("/add-product",adminController.addProducts);

// /admin/admin-product
router.get("/admin-product",adminController.getProducts);

// /admin/edit-product
router.get("/edit-product/:productId",adminController.editProducts);

// /admin/product (POST)
router.post("/product",adminController.postProducts);

// /admin/edit-product (POST)
router.post('/edit-product',adminController.postEditProducts)

// /admin/delete-product (POST)
router.post('/delete-product',adminController.deleteProducts);

exports.routes = router;