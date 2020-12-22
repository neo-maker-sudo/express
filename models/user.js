const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username,email,cart,id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart (product){
        const cartProductIndex = this.cart.items.findIndex(cp =>{
            return cp.productId.toString() === product._id.toString();
        });
        const oldQuantity = 1;
        const updateCartItems = [...this.cart.items];
        if(cartProductIndex >= 0){
            const newQuantity = updateCartItems[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQuantity;
        }else{
            updateCartItems.push({
                productId : new mongodb.ObjectId(product._id),
                quantity: oldQuantity
            });
        }
        const updateCart = { items : updateCartItems}
        const db = getDb();
        return db.collection('users')
        .updateOne(
            { _id : new mongodb.ObjectId(this._id)},
            {$set : {cart : updateCart}}
            )
    }
    static findById (userId){
        const db = getDb();
        return db.collection('users').find({ _id : new mongodb.ObjectId(userId)})
        .next()
        .then(user=>{
            console.log(user)
            return user;
        })
        .catch(err=>console.log(err))
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i=>{
            return i.productId;
        });
        return db.collection('products')
        .find({ _id : {$in : productIds} })
        .toArray()
        .then(products=>{
            return products.map(p=>{
                return {
                    ...p, 
                    quantity : this.cart.items.find(i=>{
                        return i.productId.toString() === p._id.toString();
                }).quantity
            }
            })
        })
    }

    getOrder (){
        const db = getDb();
        return db.collection('orders')
        .find({'user._id' : new mongodb.ObjectId(this._id)})
        .toArray()
    }

    addOrder (){
        const db = getDb();
        return this.getCart()
        .then(products=>{
            console.log(products);
            const order = {
                items : products,
                user: {
                    _id : new mongodb.ObjectId(this._id),
                    name : this.name
                }
            };
            return db.collection('orders').insertOne(order)
        })
        .then(result=>{
            this.cart = { items : []};
            return db.collection('users')
            .updateOne(
                { _id : new mongodb.ObjectId(this._id)},
                { $set : { cart : { items : [] } } }
            )
        })
    }

    deleteItemFromCart(productId){
        const updateCartItems = this.cart.items.filter(item =>{
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users')
        .updateOne(
            { _id : new mongodb.ObjectId(this._id) },
            { $set : {cart : { items : updateCartItems } } }
        );
    }
}

module.exports = User;