//models
const Product = require('../models/product')

//Add product ::GET
exports.getAddProduct = (req,res,next)=>{
    res.render('products/add-product',{
        pageTitle : 'اضف عقارك'
    })
}

//Add Product ::POST
exports.postAddProduct = (req,res,next)=>{
    const name = req.body.name
    const image = req.body.image
    const size = req.body.size
    const rooms = req.body.rooms
    const bathroom = req.body.bathroom
    const price = req.body.price
    const author = {
        id : req.user._id,
        username : req.user.email
    }
    const newproduct = new Product( {
        name:name,
        image:image,
        size:size,
        rooms:rooms,
        bathroom:bathroom,
        price:price,
        author:author
    })
    newproduct.save()
    .then(product =>{
        console.log(product)
        res.redirect('/')
    })
    .catch(err => {console.log(err)})
}

//Product info ::GET
exports.getProductInfo = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .then(product=>{
        res.render('products/product-info',{
            product:product,
            pageTitle: product.name
        })
    })
    .catch(err=>{console.log(err)})
}

//Product Edit ::GET
exports.getProductEdit = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .then(product =>{
        res.render('products/edit-product',{
            product:product,
            pageTitle: product.name + 'Edit'
        })
    })
    .catch()
}

//Product Edit ::PUT
exports.postEditProduct = (req,res,next)=>{
    const prodId = req.params.productId
    const newData = {
        name:req.body.name,
        image : req.body.image,
        size : req.body.size,
        rooms : req.body.rooms,
        bathroom : req.body.bathroom,
        price : req.body.price
    }
    Product.findByIdAndUpdate(prodId,newData)
    .then(product=>{
        res.redirect('/product/'+product._id)
    })
    .catch(err=>console.log(err))
}

//Product Delete
exports.deleteProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findByIdAndRemove(prodId)
    .then(product=>{
        console.log(product.name+'Deleted')
        res.redirect('/')
    })
    .catch(err=>{console.log(err)})
}