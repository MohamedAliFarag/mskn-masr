//models
const Product = require('../models/product')

//home ::GET
exports.getIndex=(req,res,next)=>{
   // eval(require('locus'))
   if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    Product.find({name : regex})
    .then(product =>{
        let noMatch
        if(product.length < 1 ){
            noMatch = "لا يوجد نتائج لهذاالبحث"
        }
        res.render('home/index',{
            pageTitle:'مسكن مصر',
            prods : product,
            noMatch
        })
    })
    .catch(err =>{
        console.log(err)
    } )
}else{
   
    Product.find({})
    .then(product =>{
        res.render('home/index',{
            pageTitle:'مسكن مصر',
            prods : product,
            noMatch : undefined
        })
    })
    .catch(err => console.log(err))
}
   }
    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}