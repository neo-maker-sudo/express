const Product = require('../models/product');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');

exports.addProducts = (req,res,next)=>{
    if(!req.session.isLoggiedIn){
        return res.redirect('/login');
    }
    res.render('admin/edit-product',{
        pagetitle : 'Add Product',
        path:'/add-product',
        editing: false,
        hasError : false,
        errorMessage : null,
        validationError : []
    });
};

exports.editProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product =>{
        if(!product){
            return res.redirect('/');
        };
        res.render('admin/edit-product',{
            pagetitle : 'Edit Product',
            path : '/edit-product',
            editing : editMode,
            product : product,
            hasError : false,
            errorMessage : null,
            validationError : []
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getProducts = (req,res,next)=>{
    Product.find({
        userId : req.user._id
    })
    .then(products =>{
        res.render('admin/admin-products',{
            prods : products ,
            pagetitle:'Admin Product',
            path:'/admin-product',
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postProducts = (req,res,next)=>{
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    if(!image){
        return res.status(422).render('admin/edit-product',{
            pagetitle : 'Add Product',
            path : '/edit-product',
            editing : false,
            hasError : true,
            product : {
                title : title,
                price : price,
                description : description
            },
            errorMessage : 'Attached file in not an image',
            validationError : []
        })
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',{
            pagetitle : 'Add Product',
            path : '/edit-product',
            editing : false,
            hasError : true,
            product : {
                title : title,
                imageUrl : imageUrl,
                price : price,
                description : description
            },
            errorMessage : errors.array()[0].msg,
            validationError : errors.array()
        })
    }

    const imageUrl = image.path;

    const product = new Product ({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId : req.session.user
    });
    product
    .save()
    .then((result)=>{
        console.log(result);
        res.redirect('/admin/admin-product');
    })
    .catch(err=>{
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    })
};

exports.postEditProducts = (req,res,next) =>{
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const image = req.file;
    const updateDescription = req.body.description;
    const updatePrice = req.body.price;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(422).render('admin/edit-product',{
            pagetitle : 'Edit Product',
            path : '/edit-product',
            editing : true,
            hasError : true,
            product : {
                title : updateTitle,
                imageUrl : updateImageUrl,
                price : updatePrice,
                description : updateDescription,
                _id : prodId
            },
            errorMessage : errors.array()[0].msg,
            validationError : errors.array()
        })
    }
    Product.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updateTitle;
        product.price = updatePrice;
        product.description = updateDescription;
        if(image){
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        return product.save()
        .then(result=>{
        res.redirect('/admin/admin-product');
    })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.deleteProducts =(req,res,next) =>{
    const deleteId = req.body.deleteId;
    
    Product.findById(deleteId)
    .then(product=>{
        if(!product){
            return next(new Error('Product not found!'))
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne( { _id : deleteId, userId : req.user._id } )
    })
    .then(product=>{
        return product
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
    res.redirect('/admin/admin-product');
};

