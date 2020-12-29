const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocumant = require('pdfkit');
const fs = require('fs');
const path = require('path');


exports.getIndex = (req,res,next)=>{
    Product.find()
    .then( products=>{
        res.render('shop/index',{
            prods : products ,
            pagetitle:'Shop',
            path:'/'
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getProducts = (req,res,next)=>{
    Product.find({
        userId : req.user._id
    })
    .then(products=>{
        res.render('shop/product-list',{
            prods : products ,
            pagetitle:'Product',
            path:'/product',
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        res.render('shop/product-detail',{
            product : product,
            pagetitle : product.title,
            path : '/products',
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
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
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
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
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
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
                email : req.user.email,
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
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getOrder = (req,res,next)=>{
    if(req.user){
    Order.find({"user.userId": req.user._id})
    .then(orders=>{
        res.render('shop/order',{
            pagetitle : 'Order page',
            path : 'order',
            orders : orders,
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
    }
    else {
        Product.find()
        .then(orders=>{
            res.render('shop/order',{
            pagetitle : 'Order page',
            path : 'order',
            orders : orders,
            })
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    }
}


exports.getInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order=>{
        if(!order){
            return new Error('not order found !!');
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            return new Error('Unauthorized!!')
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data','invoices',invoiceName);

        const pdfDoc = new PDFDocumant();
        res.setHeader('Content-type','application/pdf');
        res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoices',{
            underline : true
        });
        pdfDoc.text('------------------------------');
        let totalPrice = 0
        order.products.forEach(prod=>{
            totalPrice += prod.quantity * prod.product.price
            pdfDoc.text(prod.product.title + ' - ' + prod.quantity + ' * '+ prod.product.price)
        })
        pdfDoc.text('Total :'+totalPrice)
        pdfDoc.end();
        // fs.readFile(invoicePath,(err,data)=>{
        // if(err){
        //     return next(err);
        // }
        // res.setHeader('Content-type','application/pdf');
        // res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"')
        // res.send(data)
        // const file = fs.createReadStream(invoicePath)

        // file.pipe(res);
    })
    .catch(err=>{
        console.log(err);
    })

}
