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


module.exports = router