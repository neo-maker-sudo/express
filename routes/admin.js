const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

// /admin/add-product
router.get("/add-product",isAuth,adminController.addProducts);

// // /admin/admin-product
router.get("/admin-product",isAuth,adminController.getProducts);

// // /admin/edit-product
router.get("/edit-product/:productId",isAuth,adminController.editProducts);

// // /admin/product (POST)
router.post(
    "/product",
    [
        body('title')
            .trim()
            .isLength({mix:3})
            .isString(),
        body('description')
            .trim()
            .isLength({mix:5,max:400})
            .isAlphanumeric(),
        body('price').isFloat()
    ],
    isAuth,adminController.postProducts);

// // /admin/edit-product (POST)
router.post(
    '/edit-product',
    [
        body('title')
            .trim()
            .isLength({mix:3})
            .isString(),
        body('description')
            .trim()
            .isLength({mix:5,max:400})
            .isAlphanumeric(),
        body('price').isFloat()
    ]
    ,isAuth,adminController.postEditProducts)

// // /admin/delete-product (POST)
router.post('/delete-product',isAuth,adminController.deleteProducts);

exports.routes = router;