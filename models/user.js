const mongoose = require('mongoose')
//passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    email:String,
    password :String,
    firstName :String,
    lastName: String,
    mobileNum:Number,
    resetToken : String,
    resetTokenExpiration : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
 
})


userSchema.plugin(passportLocalMongoose,{usernameField:'email'})
module.exports = mongoose.model('User', userSchema)