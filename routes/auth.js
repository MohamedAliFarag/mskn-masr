const express = require('express')
const router = express.Router()
const passport = require('passport')
const authRoutes = require('../controllers/auth')

//register ::GET
router.get('/register',authRoutes.getRegister)

//register ::POST
router.post('/register',authRoutes.postRegister)

//login ::GET
router.get('/login',authRoutes.getLogin)

//login ::POST
router.post('/login',passport.authenticate('local',{
     successRedirect:'/',
     failureRedirect:'/login',
     failureFlash:'اسم المستخدم او الباسورد خطأ',
     successFlash:"اهلا بك مره اخرى"
}),(req,res)=>{
    res.redirect('/')
}
)

router.post('/login',(req,res,next)=>{

})

//logout ::GET
router.get('/logout',authRoutes.getLogout)

//reset password ::GET
router.get('/reset-password',authRoutes.resetPassword)

//reset password ::POST
router.post('/reset',authRoutes.postResetPassword)

//new password ::GET
router.get('/reset/:token',authRoutes.getNewPassword)

//new password ::POST
router.post('/new-password',authRoutes.postNewPassword)

//user profile
router.get('/profile/:userId',authRoutes.userProfile)


module.exports = router