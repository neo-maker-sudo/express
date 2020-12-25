const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorController = require('./controllers/404');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URL = 'mongodb+srv://neo:FGG88SyM0tSdYWM3@cluster0.2wcgz.mongodb.net/shop'
const store = new mongoDBStore({
    uri : MONGODB_URL,
    collection : 'sessions'
});

const csrfProtection = csrf();

app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(
    session({ 
        secret:'my secret',
        resave:false,
        saveUninitialized:false,
        store : store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggiedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
})

app.use('/admin',adminRouter.routes);
app.use(shopRouter);
app.use(authRouter);
app.use(errorController.fourofour);

mongoose.connect(MONGODB_URL)
.then(result=>{
    // User.findOne().then(user=>{
    //     if(!user){
    //         const user = new User ({
    //             name : 'neo',
    //             email : 'abc@gmail.com',
    //             cart : {
    //                 items : []
    //             }
    //         })
    //         user.save()
    //     }
    // })
    app.listen(3000);
})
.catch(err=>{
    console.log(err)
})


