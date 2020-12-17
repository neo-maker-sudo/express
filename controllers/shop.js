const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req,res,next)=>{
    Product.fetchAll( products => {
        res.render('shop/index',{
        prods : products ,
        pagetitle:'Shop',
        path:'/'
        });
    });
};

exports.getProducts = (req,res,next)=>{
    Product.fetchAll( products => {
        res.render('shop/product-list',{
        prods : products ,
        pagetitle:'Product',
        path:'/product'
        });
    });
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId, product =>{
        res.render('shop/product-detail',{
            product : product,
            pagetitle : product.title,
            path : '/products'
        })
    });
}

exports.getCart = (req,res,next)=>{
    res.render('shop/cart',{
        pagetitle : 'Cart page',
        path : '/cart'
    });
};

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId, product =>{
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart');
};

exports.getOrder = (req,res,next)=>{
    res.render('shop/order',{
        pagetitle : 'Order page',
        path : 'order'
    })
}
exports.checkOut = (req,res,next)=>{
    res.render('shop/checkout',{
        pagetitle : 'checkout',
        path : '/checkout'
    });
};
