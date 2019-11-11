const express = require('express')
const router = express.Router()
//controllers
const productsController = require('../controllers/products')

//add-product ::Get
router.get('/add-product',productsController.getAddProduct)

//add-product ::Post
router.post('/add-product',productsController.postAddProduct)
module.exports = router

//Product Details ::GET
router.get('/product/:productId',productsController.getProductInfo)

//Edit Product ::GET
router.get('/product/:productId/edit',productsController.getProductEdit)

//Edit Product ::PUT
router.put('/product/:productId',productsController.postEditProduct)

//Delete Product ::Delete
router.delete('/product/:productId',productsController.deleteProduct)