const Product = require('../models/product');

exports.addProducts = (req,res,next)=>{
    res.render('admin/edit-product',{
        pagetitle : 'Add Product',
        path:'/add-product',
        editing: false
    });
};

exports.editProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    Product.findById(prodId,product =>{
        res.render('admin/edit-product',{
        pagetitle : 'Edit Product',
        path : '/edit-product',
        editing : editMode,
        product : product
        });
    })
}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll( products => {
        res.render('admin/admin-products',{
        prods : products ,
        pagetitle:'Admin Product',
        path:'/admin-product'
        });
    });
}

exports.postProducts = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title,imageUrl,description,price);
    product.save();
    res.redirect('/');
};