const express = require('express')
const router = express.Router()
//controllers
const productsController = require('../controllers/products')
//Models
const Product = require('../models/product')



//add-product ::Get
router.get('/add-product',isLoggedin,productsController.getAddProduct)

//add-product ::Post
router.post('/add-product',isLoggedin,productsController.postAddProduct)


//Product Details ::GET
router.get('/product/:productId',productsController.getProductInfo)

//Edit Product ::GET
router.get('/product/:productId/edit',isLoggedin,checkOwnerShip,productsController.getProductEdit)

//Edit Product ::PUT
router.put('/product/:productId',isLoggedin,checkOwnerShip,productsController.postEditProduct)

//Delete Product ::Delete
router.delete('/product/:productId',isLoggedin,checkOwnerShip,productsController.deleteProduct)


//Middlewars

//check if there is a user
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','يجب ان تسجل الدخول اولا')
    res.redirect('/login')
}

//check if user has ownership
function checkOwnerShip(req,res,next){
    if(req.isAuthenticated()){
        Product.findById(req.params.productId,(err,product)=>{
            if(err || !product){
                req.flash('error','هذا العقار لم يعد متاح او انك تحاول فعل شئ لا تمتلك الاذن له')
                res.redirect('back')
            }else{
                if(product.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash('error','هذا العقار لم يعد متاح او انك تحاول فعل شئ لا تمتلك الاذن له')
                    res.redirect('back')
                }
            }
        })
    }
}



module.exports = router

