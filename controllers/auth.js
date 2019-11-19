//models
const User = require('../models/user')
//passport
const passport = require('passport')


//Register ::GET
exports.getRegister = (req,res,next)=>{
    res.render('auth/register',{
        pageTitle:'اشتراك'
    })
}

//Register ::POST
exports.postRegister = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    User.register(new User({email:email}),password,(err,user)=>{
        if(err){
            console.log(err)
            req.flash('error','لم تتم عمليه تسجيل')
            return res.redirect('/register')
        }
        passport.authenticate('local')(req, res, function () {
            console.log(user)
            req.flash('success','تم تسجيل الحساب بنجاح')
            res.redirect('/');
        });
    })
}

//login ::GET
exports.getLogin = (req,res,next)=>{
    res.render('auth/login',{
        pageTitle : 'تسجيل دخول'
    })
}

// //login ::POST
// exports.postLogin = (req,res,next)=>{
//     req.flash('success','تم تسجيل دخولك')
//     res.redirect('/')
//     console.log('logged in succesfully')
// }

//logout ::GET
exports.getLogout = (req,res,next)=>{
    req.logout()
    req.flash('success','تم تسجيل خروجك')
    res.redirect('/')
}