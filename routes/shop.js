const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

// /
router.get("/",shopController.getIndex);

// /product (GET)
router.get("/product",shopController.getProducts);

//
router.get("/products/:productId",shopController.getProduct);

// /cart
router.get("/cart",shopController.getCart);

// /cart (POST)
router.post("/cart",shopController.postCart);

// /cart/cart-delete-item (POST)
router.post('/cart-delete-item',shopController.cartDeleteItem); 

// /create-order (POST)
router.post('/create-order',shopController.postOrder);

// /order
router.get("/order",shopController.getOrder);

// /checkout
// router.get("/checkout",shopController.checkOut);




module.exports = router;