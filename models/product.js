const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor (id,title,imageUrl,description,price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save (){
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), err => {
                    if(err) throw err;
                });
            }
            else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    if(err) throw err;
                })
            };
        })
    }
    static delete (id){
        getProductsFromFile( products =>{
                const product = products.find(prod => prod.id === id);
                const existingProductIndex = products.findIndex(
                    prod => prod.id === id
                );
                const deleteProducts =  [...products];
                deleteProducts.splice(existingProductIndex,1);
                fs.writeFile(p, JSON.stringify(deleteProducts), err => {
                    if(err) throw err;
                });
                Cart.deleteCart(id,product.price);
        });
    }

    static fetchAll (cb){
        getProductsFromFile(cb);
    }

    static findById (id,cb) {
        getProductsFromFile( products =>{
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}