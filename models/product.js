const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    image:{
        type:String,
        required: true
    },
    imageId:String,
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
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    phoneNum : {
        type : Number,
        required : true
    },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        firstName: String,
        lastName : String
    }
})


module.exports = mongoose.model('Product',productSchema)