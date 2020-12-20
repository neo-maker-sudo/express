const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/404');
const app = express();
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

Product.belongsTo(User,{ constraints : true , onDelete : 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{ through : CartItem });
Product.belongsToMany(Cart,{ through : CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{ through : OrderItem });

app.use((req,res,next)=>{
    User.findByPk(2)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>console.log(err));
});

app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRouter.routes);
app.use(shopRouter);
app.use(errorController.fourofour);


sequelize
.sync()
.then(()=>{
    return User.findByPk(2);
})
.then(user=>{
    if(!user){
        return User.create({name:'Neo', email:'test@test.com'});
    }
    return user
})
.then(user=>{
    return user.createCart()
})
.then(user=>{
    app.listen(3000);
})
.catch(err => console.log(err));