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
    },author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String
    }
})


module.exports = mongoose.model('Product',productSchema)