//models
const Product = require('../models/product')
//cloudinary
const cloudinary = require('cloudinary')
//cloudinary
cloudinary.config({ 
    cloud_name: 'masknmasr', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const multer = require('multer')
  
//*** Controllers ***


//Add product ::GET
exports.getAddProduct = (req,res,next)=>{
    res.render('products/add-product',{
        pageTitle : 'اضف عقارك'
    })
}

//Add Product ::POST
exports.postAddProduct = (req,res,next)=>{
    if(req.errorImage){
        console.log(req.errorImage)
        req.flash('error','صيغه الصوره غير مناسبه يجب ان تكون jpg,jpeg,png')
        return res.redirect('back')
    }
    cloudinary.v2.uploader.upload(req.file.path, 
    (err,result)=> {
        if(err){
            req.flash('error','شئ خطا قد حدث')
            res.redirect('back')
        }
    const name  = req.body.name
    const image = result.secure_url
    const imageId = result.public_id
    const size  = req.body.size
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
        imageId:imageId,
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
    const updatedName     = req.body.name
    const updatedImage    = req.file.path
    const updatedSize     = req.body.size
    const updatedRooms    = req.body.rooms
    const updatedBathroom = req.body.bathroom
    const updatedPrice    = req.body.price
    Product.findById(req.params.productId)
    .then(async product=>{
        if(req.file){
        try{
            await cloudinary.v2.uploader.destroy(product.imageId)
            let result = await cloudinary.v2.uploader.upload(updatedImage)
            console.log(result)
            product.image = result.secure_url
            product.imageId = result.public_id
        }catch(err){
            req.flash('error','لم يتم تغير الصوره')
            return res.redirect('back')
        }
    }
        product.name     = updatedName
        product.size     = updatedSize
        product.rooms    = updatedRooms
        product.bathroom = updatedBathroom
        product.price    = updatedPrice
        product.save()
        req.flash('success','تم تسجيل التعديل بنجاح')
        res.redirect('/product/'+product._id)
    })
    .catch(err =>{
        req.flash('error','حدث خطا لم تتم العمليه بتجاح')
        res.redirect('back')
        console.log(err)
    })
}

//Product Delete
exports.deleteProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .then(async product=>{
        console.log(product.name+'Deleted')
        await cloudinary.v2.uploader.destroy(product.imageId)
        await product.remove()
        req.flash('success','تم مسح العقار بنجاح')
        res.redirect('/')
    })
    .catch(err=>{
        req.flash('error','لم يتم الامر بنجاح')
        res.redirect('back')
        console.log(err)})
}