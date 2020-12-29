const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
// /
router.get("/",shopController.getIndex);

// // /product (GET)
router.get("/product",shopController.getProducts);

// //
router.get("/products/:productId",shopController.getProduct);

// // /cart
router.get("/cart",isAuth,shopController.getCart);

// // /cart (POST)
router.post("/cart",isAuth,shopController.postCart);

// // /cart/cart-delete-item (POST)
router.post('/cart-delete-item',isAuth,shopController.cartDeleteItem); 

// // /create-order (POST)
router.post('/create-order',isAuth,shopController.postOrder);

// // /order
router.get("/order",isAuth,shopController.getOrder);

router.get("/order/:orderId",isAuth,shopController.getInvoice)

module.exports = router;