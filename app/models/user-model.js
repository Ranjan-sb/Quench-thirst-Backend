const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    username : String,                
    email : String,
    password : String,
    mobileNumber : String,
    role : String,
    otp : String,
    isApproved:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean, 
        default:false
    }
},{ timestamps : true })

const User = model('User',userSchema)

module.exports = User