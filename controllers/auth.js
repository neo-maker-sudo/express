const User = require('../models/user');
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
// const transporter = nodemailer.createTransport(sendgrid({
//     auth : {
//         api_key : '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'
//     }   
// }));

exports.getLogin = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login',{
        pagetitle : 'Login page',
        path : '/login',
        errorMessage : message,
        oldput : {
            email : "",
            password : "",
        },
        validationError : []
    })
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login page',
        errorMessage : errors.array()[0].msg,
        oldput : {
            email : email,
            password : password,
        },
        validationError : errors.array()
        })
    }
    User.findOne({email:email})
    .then(user=>{
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.user = user;
                req.session.isLoggiedIn = true
                return req.session.save(err=>{
                    console.log(err)
                    res.redirect('/');
                })
            }
            req.flash('error','Invalid email or password')
            res.redirect('/login');
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    })
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err)
        res.redirect('/');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage : message,
        oldput : {
            email : "",
            password : "",
            confirmPassword : ""  
        },
        validationError : []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors.array())
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage : errors.array()[0].msg,
        oldput : {
            email : email,
            password : password,
            confirmPassword : req.body.confirmPassword
        },
        validationError : errors.array()
        })
    }
        // email : abc@gmail.com　password : 123456
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user = new User({
            email : email,
            password : hashedPassword,
            cart : { items : [] }
        });
        return user.save();;
    })
    .then(result=>{
        res.redirect('/login');
        // return transporter.sendMail({
        //     to : email,
        //     from : 'eyywqkgb@gmail.com',
        //     subject : 'sign up succeed !!',
        //     html : '<h1>congrats !! you are our merber now !</h1>'
        // })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.getReset = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset page',
        errorMessage : message
    });
}

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('error','Don\'t have this email')
                return res.redirect('/reset')
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        })
        .then(result=>{
            console.log(token);
            res.redirect('/reset/'+token);
            // res.redirect('/login');
            // return transporter.sendMail({
            //     to : email,
            //     from : 'eyywqkgb@gmail.com',
            //     subject : 'password reset !!',
            //     html : '<h1>Change your own password now !</h1>'
            // })
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    })
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne( {resetToken : token, resetTokenExpiration: { $gt:Date.now() } } )
    .then(user=>{
        let message = req.flash('error');
        if(message.length > 0){
            message = message[0];
        }else{
            message = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password page',
            errorMessage : message,
            userId : user._id.toString(),
            passwordToken : token
        });
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postNewPassword = (req,res,next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken =req.body.passwordToken;
    console.log(passwordToken)
    let resetUser;
    User.findOne({
        resetToken : passwordToken,
        resetTokenExpiration: { $gt:Date.now() },
        _id : userId
    })
    .then(user=>{
        resetUser = user;
        return bcrypt.hash(newPassword,12);
    })
    .then(hashedPassword=>{
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration =undefined;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}