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
router.post('/login',
    passport.authenticate('local',{failureRedirect:'/login'}),authRoutes.postLogin)

//logout ::GET
router.get('/logout',authRoutes.getLogout)


module.exports = router