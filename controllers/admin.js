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
    const product = new Product(null,title,imageUrl,description,price);
    product.save();
    res.redirect('/');
};

exports.postEditProducts = (req,res,next) =>{
    console.log(req.body.title);
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const updateImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    const updatePrice = req.body.price;
    const updateProduct = new Product(
        prodId,
        updateTitle,
        updateImageUrl,
        updateDescription,
        updatePrice
    );
    updateProduct.save();
    res.redirect('/admin/admin-product');
};

exports.deleteProducts =(req,res,next) =>{
    const deleteId = req.body.deleteId;
    Product.delete(deleteId);
    res.redirect('/admin/admin-product');
};

