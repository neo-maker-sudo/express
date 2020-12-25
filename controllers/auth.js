const User = require('../models/user');
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

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
        errorMessage : message
    })
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            req.flash('error','Invalid email or password')
            return res.redirect('/login');
        }
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
            console.log(err);
        })
    })
    .catch(err=>console.log(err));
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
        errorMessage : message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            req.flash('error','Email exists already, use another one !!')
            return res.redirect('/signup');
        }
        else if (confirmPassword !== password){
            req.flash('error','Please confirm both of password columns !!');
            return res.redirect('/signup');
        }
        // email : abc@gmail.com　password : abc@gmail.com
        return bcrypt
        .hash(password,12)
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
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
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
            res.redirect('/login');
            // return transporter.sendMail({
            //     to : email,
            //     from : 'eyywqkgb@gmail.com',
            //     subject : 'password reset !!',
            //     html : '<h1>Change your own password now !</h1>'
            // })
        })
        .catch(err=>{
            console.log(err);
        })
    })
}