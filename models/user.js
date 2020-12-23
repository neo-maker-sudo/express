const Product = require('./product');
const Order = require('./order');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
        {
            productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
            },
            quantity: { type: Number, required: true }
        }
        ]
    }
    });

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    console.log(updatedCartItems);
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    console.log(this.cart)
    return this.save();
};

// userSchema.methods.getCart = function () {
//         const productIds = this.cart.items.map(i=>{
//             return i.productId;
//         });
//         return Product.find({ _id : {$in : productIds} })
//         .then(products=>{
//             return products.map(p=>{
//                 return {
//                     ...p, 
//                     quantity : this.cart.items.find(i=>{
//                         return i.productId.toString() === p._id.toString();
//                 }).quantity
//             }
//             })
//         })
//     }

userSchema.methods.removeFromCart = function (productId){
    const updateCartItems = this.cart.items.filter(item =>{
            return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updateCartItems;
    return this.save();
}

userSchema.methods.clearCart = function (){
    this.cart = {items:[]};
    return this.save();
}
module.exports = mongoose.model('User', userSchema);