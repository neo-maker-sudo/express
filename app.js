const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const handleBar = require('express-handlebars');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/404');
const app = express();

// app.engine('hbs',handleBar());
// app.set('view engine','hbs');
// app.set('view engine','ejs');
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRouter.routes);
app.use(shopRouter);
app.use(errorController.fourofour);
app.listen(3000);