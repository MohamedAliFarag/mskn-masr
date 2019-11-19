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
        req.flash('success','تم اضافه عقارك بنجاح')
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
        req.flash('error','لم يتم تسجيل عقارك , برجاء المحاوله مره اخرى')
        res.redirect('/add-product')
    })
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
    .catch(err=>{
        req.flash('error','يبدو ان هذاالعقار لم يعد موجود')
        res.redirect('/')
        console.log(err)})
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
    .catch(err=>{
        console.log(err)
    })
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
        req.flash('success','تم تسجيل التعديل بنجاح')
        res.redirect('/product/'+product._id)
    })
    .catch(err=>{
        console.log(err)
        req.flash('error','لم يتم تسجيل التعديل')
        res.redirect('/')
    })
}

//Product Delete
exports.deleteProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findByIdAndRemove(prodId)
    .then(product=>{
        console.log(product.name+'Deleted')
        req.flash('success','تم مسح العقار بنجاح')
        res.redirect('/')
    })
    .catch(err=>{
        req.flash('error','لم يتم الامر بنجاح')
        res.redirect('back')
        console.log(err)})
}