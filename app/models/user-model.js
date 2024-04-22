const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    username : String,                
    email : String,
    password : String,
    mobileNumber : String,
    role : String,
    otp : String,
    isVerified:{
        type:Boolean, 
        default:false
    },
    building : {
        type:String
    },
    locality:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    pinCode:{
        type:String
    },
    country:{
        type:String
    },
    location:{
        type:{
            type : String
        },
        coordinates: {      
            type : [Number] //geoSpatial Data
        }
    }
},{ timestamps : true })

const User = model('User',userSchema)

module.exports = User