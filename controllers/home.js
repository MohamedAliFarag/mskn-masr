const Product = require('../models/product')

//home ::GET
exports.getIndex=(req,res,next)=>{
    Product.find()
    .then(product =>{
        res.render('home/index',{
            pageTitle:'مسكن مصر',
            prods : product
        })
    })
    .catch(err => console.log(err))
}