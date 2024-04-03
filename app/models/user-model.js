const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    username : String,
    email : String,
    mobileNumber : Number,
    role : String,
    isApproved:{
        type:Boolean,
        default:false
    },
    // otp : {
    //     type : Number,
    //     required : true
    // },

},{ timestamps : true })

const User = model('User',userSchema)

module.exports = User