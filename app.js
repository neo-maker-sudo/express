const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/404');
const app = express();
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


app.use((req,res,next)=>{
    User.findById("5fe20b2d3076334e8e2aa8ad")
    .then(user=>{
        req.user = new User(user.name,user.email,user.cart,user._id);
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



mongoConnect(()=>{
    app.listen(3000);
})