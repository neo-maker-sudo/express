const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
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

const fileStorage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,'images');
    },
    filename : (req,file,cb)=>{
        cb(null, file.filename + '-' + file.originalname);
        // new Date().toISOString()
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
} 

app.set('view engine','pug');

const errorController = require('./controllers/error');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({extended : false}));
app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
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
    res.locals.isAuthenticated = req.session.isLoggiedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err=>{
        next(new Error(err));
    });
});

app.use('/admin',adminRouter.routes);
app.use(shopRouter);
app.use(authRouter);


app.get('/500',errorController.get500);
app.use(errorController.fourofour);

app.use((error,req,res,next)=>{
    // console.log(req)
    res.status(500).render('500',{
        pagetitle : 'Error !!', 
        path:'',
        isAuthenticated : req.session.isLoggiedIn
    });
})

mongoose.connect(MONGODB_URL)
.then(result=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err)
})


