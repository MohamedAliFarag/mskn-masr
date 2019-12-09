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
    const phoneNum = req.body.phoneNum
    const author = {
        id : req.user._id,
        firstName : req.user.firstName,
        lastName : req.user.lastName
    }
    const newproduct = new Product( {
        name:name,
        image:image,
        imageId:imageId,
        size:size,
        rooms:rooms,
        bathroom:bathroom,
        price:price,
        author:author,
        phoneNum : phoneNum
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
    //find product by id
    Product.findById(req.params.productId)
    .then(async product=>{
        // if there is an image
        if(req.file){
        try{
            //delete the image on the cloudinary by its imageId
            //upload the new image by get it from the form using multer req.file.path
            await cloudinary.v2.uploader.destroy(product.imageId)
            let result = await cloudinary.v2.uploader.upload(req.file.path)
            console.log(result)
            // After that save the new image URL and ID in the DB
            product.image   = result.secure_url
            product.imageId = result.public_id
        }catch(err){
            console.log(err)
            req.flash('error','لم يتم تغير الصوره')
            return res.redirect('back')
        }
    }
        product.name     = req.body.name
        product.size     = req.body.size
        product.rooms    = req.body.rooms
        product.bathroom = req.body.bathroom
        product.price    = req.body.price
        product.phoneNum = req.body.phoneNum
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