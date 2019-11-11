const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    image:{
        type:String,
        required :true
    },
    size : {
        type:Number,
        required:true
    },
    rooms:{
        type:Number,
        required:true
    },
    bathroom:{
        type:Number,
        required:true
    },
    location:{
        type: String,
        required:false
    },
    price : {
        type:Number,
        required:true
    }
})


module.exports = mongoose.model('Product',productSchema)