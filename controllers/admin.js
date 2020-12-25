const Product = require('../models/product');

exports.addProducts = (req,res,next)=>{
    if(!req.session.isLoggiedIn){
        return res.redirect('/login');
    }
    res.render('admin/edit-product',{
        pagetitle : 'Add Product',
        path:'/add-product',
        editing: false,
        isAuthenticated : req.session.isLoggiedIn
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
            isAuthenticated : req.session.isLoggiedIn
        })
    }).catch(err=>console.log(err));
}

exports.getProducts = (req,res,next)=>{
    Product.find()
    .then(products =>{
        res.render('admin/admin-products',{
            prods : products ,
            pagetitle:'Admin Product',
            path:'/admin-product',
            isAuthenticated : req.session.isLoggiedIn
        });
    })
    .catch(err=>{console.log(err)})
}

exports.postProducts = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product ({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId : req.session.user
    });
    product.save()
    .then((result)=>{
        console.log(result);
        res.redirect('/admin/admin-product');
    })
    .catch(err=>console.log(err)) 
};

exports.postEditProducts = (req,res,next) =>{
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const updateImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    const updatePrice = req.body.price;
    Product.findById(prodId)
    .then(product=>{
        product.title = updateTitle;
        product.imageUrl = updateImageUrl;
        product.description = updateDescription;
        product.price = updatePrice;
        return product.save()
    })
    .then(result=>{
        console.log(result);
    })
    .catch(err=>console.log(err))
    res.redirect('/admin/admin-product');
};

exports.deleteProducts =(req,res,next) =>{
    const deleteId = req.body.deleteId;
    Product.findByIdAndDelete(deleteId)
    .then(product=>{
        return product
    })
    .then( result=>{
        console.log(result)
    })
    .catch(err=>console.log(err))
    res.redirect('/admin/admin-product');
};

