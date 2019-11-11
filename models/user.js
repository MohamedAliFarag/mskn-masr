const mongoose = require('mongoose')
//passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    email:String,
    password :String
 
})


userSchema.plugin(passportLocalMongoose,{usernameField:'email'})
module.exports = mongoose.model('User', userSchema)