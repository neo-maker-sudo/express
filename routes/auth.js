const express = require('express');
const authController = require('../controllers/auth');
const { check,body } = require('express-validator/check');
const User = require('../models/user')
const router = express.Router();

router.get('/login',authController.getLogin);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .custom((value,{req})=>{
                return User.findOne({email:value}).then(user=>{
                    if(!user){
                        return Promise.reject('You are not our member. Please sign up first!')
                    }
                    return true
                })
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter correct password with number and text between 6 - 8 characters'
        )
            .isLength({min:6,max:8})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.post('/logout',authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email','Not Valid Email !!')
            .isEmail()
            .custom((value,{req})=>{
                return User.findOne({email:value}).then(userDoc=>{
                    if(userDoc){
                        return Promise.reject('Email exists already, use another one !!');
                    }
                    return true
                })
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter correct password with number and text between 6 - 8 characters'
        )
            .isLength({min:6,max:8})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value,{req})=>{
                if(value !== req.body.password){
                    throw new Error('Password must match !!');
                }
                return true
            })
    ],
    authController.postSignup
    );

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);

module.exports = router;
