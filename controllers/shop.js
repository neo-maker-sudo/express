const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req,res,next)=>{
    Product.find()
    .then( products=>{
        res.render('shop/index',{
            prods : products ,
            pagetitle:'Shop',
            path:'/',
            isAuthenticated : req.isLoggedIn
        });
    })
    .catch(err =>{console.log(err);});
};

exports.getProducts = (req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('shop/product-list',{
            prods : products ,
            pagetitle:'Product',
            path:'/product',
            isAuthenticated : req.isLoggedIn
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
            path : '/products',
            isAuthenticated : req.isLoggedIn
        })
    })
    .catch(err => console.log(err));
}

exports.getCart = (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items;
        res.render('shop/cart',{
            pagetitle : 'Cart page',
            path : '/cart',
            products : products,
            isAuthenticated : req.isLoggedIn
        });
    })
    .catch(err=>console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    });
};


exports.cartDeleteItem = (req,res,next) =>{
    const prodId = req.body.productId;
    req.user
    .removeFromCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

exports.postOrder = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(i=>{
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
            user: {
                name : req.user.name,
                userId : req.user
            },
            products : products
        })
        return order.save();
    })
    .then(result=>{
        return req.user.clearCart();
    })
    .then(()=>{
        res.redirect('/order');
    })
    .catch(err=>console.log(err));
}

exports.getOrder = (req,res,next)=>{
    Order.find({"user.userId": req.user._id})
    .then(orders=>{
        res.render('shop/order',{
            pagetitle : 'Order page',
            path : 'order',
            orders : orders,
            isAuthenticated : req.isLoggedIn
        })
    })
    .catch(err=>console.log(err));
}

