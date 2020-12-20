const Product = require('../models/product');
const Order = require('../models/order');
const orderItem = require('../models/order-item');

exports.getIndex = (req,res,next)=>{
    Product.findAll()
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
    Product.findAll()
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
    Product.findByPk(prodId)
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
    .then(cart=>{
        return cart.getProducts()
        .then(prodcuts=>{
            res.render('shop/cart',{
                pagetitle : 'Cart page',
                path : '/cart',
                products : prodcuts
            });
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
    // Cart.getCartProduct( cart =>{
    //     Product.fetchAll()
    //     .then(([cartProducts,fieldData])=>{
    //         console.log({...cartProducts});
    //         for(product of cartProducts){
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData : product, qty : cartProductData.qty});
    //             }
    //         }
    //     .catch(err=>{console.log(err)})
    // });
};

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart =>{
        fetchCart = cart;
        return cart.getProducts({where :{id:prodId}});
    })
    .then(products=>{
        let product;
        if(products.length > 0){
            product = products[0];
        }
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1
            return product; 
        }
        return Product.findByPk(prodId);
    })
    .then(product=>{
        return fetchCart.addProduct(product,{
            through : {quantity : newQuantity}
        });
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
};

exports.checkOut = (req,res,next)=>{
    res.render('shop/checkout',{
        pagetitle : 'checkout',
        path : '/checkout'
    });
};

exports.cartDeleteItem = (req,res,next) =>{
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where : {id:prodId}})
    })
    .then(products=>{
        const product = products[0]
        return product.cartItem.destroy({id:prodId});
    })
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

exports.postOrder = (req,res,next) => {
    let fetchCart;
    req.user.getCart()
    .then(cart=>{
        fetchCart =cart;
        return cart.getProducts();
    })
    .then(products=>{
        return req.user.createOrder()
        .then(order=>{
            return order.addProducts(
                products.map(product => {
                    product.orderItem = {quantity : product.cartItem.quantity};
                    return product;
                })
            );
        })
        .catch(err=>console.log(err));
    })
    .then(resutl=>{
        return fetchCart.setProducts(null);
    })
    .then(result=>{
        res.redirect('/order');
    })
    .catch(err=>console.log(err));
}

exports.getOrder = (req,res,next)=>{
    req.user.getOrders({include:['products']})
    .then(orders=>{
        console.log(orders[0].products);
        res.render('shop/order',{
            pagetitle : 'Order page',
            path : 'order',
            orders : orders
        })
    })
    .catch(err=>console.log(err));
}

// 