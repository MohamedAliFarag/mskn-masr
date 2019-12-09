//models
const User = require('../models/user')
const Product = require('../models/product')
//passport
const passport = require('passport')
//crypto - nodejs module to generate token
const crypto = require('crypto')
//nodemailer
const nodemailer = require('nodemailer')
//sendgrid
const sendGridTransport = require('nodemailer-sendgrid-transport')
//Email Setup
const transporter = nodemailer.createTransport(sendGridTransport({
    auth : {
        api_key: process.env.SENDGRID_API_KEY
    }
}))


//*** Controllers ***

//Register ::GET
exports.getRegister = (req,res,next)=>{
    res.render('auth/register',{
        pageTitle:'اشتراك'
    })
}

//Register ::POST
exports.postRegister = (req,res,next)=>{
    const newUser = new User({
         email     : req.body.email,
         firstName : req.body.firstName,
         lastName  : req.body.lastName,
         mobileNum : req.body.phoneNum
    })
    
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err)
            req.flash('error','لم تتم عمليه تسجيل')
            return res.redirect('/register')
        }
        passport.authenticate('local')(req, res, () => {
            console.log(user)
            req.flash('success','تم تسجيل الحساب بنجاح')
            res.redirect('/');
            return transporter.sendMail({
                to : email,
                from : 'Mohamedali.itc@gmail.com',
                subject: 'تم التسجيل بنجاح اهلا بك معنا',
                html:`welcome master you have succesfully registred by this email ${email}`
            })
        })
    })
}

//login ::GET
exports.getLogin = (req,res,next)=>{
    res.render('auth/login',{
        pageTitle : 'تسجيل دخول'
    })
}

//logout ::GET
exports.getLogout = (req,res,next)=>{
    req.logout()
    req.flash('success','تم تسجيل خروجك')
    res.redirect('/')
}

//reset password ::GET
exports.resetPassword = (req,res,next)=>{
    res.render('auth/reset',{
        pageTitle : 'تغير الباسورد'
    })
}

//reset password ::POST
exports.postResetPassword = (req,res,next)=>{
    //make a token using crypto
    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err)
            return res.redirect('/reset-password')
        }
        const token = buffer.toString('hex')
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                req.flash('error','لا يوجد هذا الايميل بقاعده البيانات')
                return res.redirect('back')
            }else{
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            }
        })
        .then(result=>{
            req.flash('success','تم ارسال ايميل لتغير كلمه المرور الخاصه بك')
            res.redirect('/')
            transporter.sendMail({
                to : req.body.email,
                from : 'Mohamedali.itc@gmail.com',
                subject: 'تغير كلمه المرور - مسكن مصر',
                html:`<h3>لقد طلبت تغير كلمه المرور</h3>
                <p><a href='https://masknmasr.herokuapp.com/reset/${token}'>يمكنك تغيرها من خلال هذا <a>اللينك</p>
                `
            })//
        })
        .catch(err => {

        })
    })
}

//new password ::GET
exports.getNewPassword = (req,res,next)=>{
    //get the token from url
    const token = req.params.token
    //search for a user have the same token and the time token not expired
    User.findOne({resetToken : token, resetTokenExpiration : {$gt : Date.now()}})
    .then(user => {
        res.render('auth/new-password',{
            pageTitle : "كلمه السر الجديده",
            // pass to the view user ID
            userId: user._id.toString(),
            //pass to the view the token
            passwordToken : token
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
    
}

// new password ::POST
exports.postNewPassword = (req,res,next)=>{
    const newPassword = req.body.password
    //get the user id from the view
    const userId = req.body.userId
    //get the password token from the view
    const passwordToken = req.body.passwordToken
    //search for user with this critria
    User.findOne({
        resetToken : passwordToken,
        resetTokenExpiration : {$gt : Date.now()},
        _id : userId
    })
    .then(user =>{
        if(!user){
            req.flash('error','اللينك خطأ او تم انتهاء زمن اللينك')
        }else{
            //change password
            user.setPassword(newPassword)
            //reset token and save
            .then(user =>{
                user.resetToken = undefined
                user.resetTokenExpiration = undefined
                user.save()
            }).then(result =>{
                req.flash('success','تم تغير الباسورد بنجاح')
                req.login(user,(err)=>{
                    if(err){
                        console.log(err)
                        req.flash('error','حدث خطا عند اعاده التوجيه')
                        res.redirect('/login')
                    }else{
                        res.redirect('/')
                    }
            })      
        })  
        }
    })
    .catch(err=>{
        console.log(err)
    })
}

//user profile
exports.userProfile = (req,res,next)=>{
    const userId = req.params.userId
    User.findById(userId)
    .then(user => {
        Product.find().where('author.id').equals(user._id).exec((err,products)=>{
            if(err){
                console.log(err)
                res.redirect('/')
            }
            res.render('user/userProfile',{
                pageTitle: 'بيانات الحساب',
                user ,
                products
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
    
}