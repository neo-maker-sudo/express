const Product = require('../models/product');


exports.getIndex = (req,res,next)=>{
    Product.fetchAll()
    .then( products=>{
        res.render('shop/index',{
            prods : products ,
            pagetitle:'Shop',
            path:'/'
        });
    })
    .catch(err =>{console.log(err);});
};

exports.getProducts = (req,res,next)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('shop/product-list',{
            prods : products ,
            pagetitle:'Product',
            path:'/product'
        });
    })
    .catch(err => {console.log(err)});
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        res.render('shop/product-detail',{
            product : product,
            pagetitle : product.title,
            path : '/products'
        })
    })
    .catch(err => console.log(err));
}

exports.getCart = (req,res,next)=>{
    req.user.getCart()
    .then(products=>{
        res.render('shop/cart',{
            pagetitle : 'Cart page',
            path : '/cart',
            products : products
        });
    })
    .catch(err=>console.log(err));
};

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product)
    })
    .then(result=>{
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
};

exports.cartDeleteItem = (req,res,next) =>{
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

exports.postOrder = (req,res,next) => {
    req.user.addOrder()
    .then(result=>{
        res.redirect('/order');
    })
    .catch(err=>console.log(err));
}

exports.getOrder = (req,res,next)=>{
    req.user.getOrder()
    .then(orders=>{
        res.render('shop/order',{
            pagetitle : 'Order page',
            path : 'order',
            orders : orders
        })
    })
    .catch(err=>console.log(err));
}


exports.checkOut = (req,res,next)=>{
    res.render('shop/checkout',{
        pagetitle : 'checkout',
        path : '/checkout'
    });
};

