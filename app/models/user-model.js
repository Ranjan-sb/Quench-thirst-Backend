const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    username : String,                
    email : String,
    password : String,
    mobileNumber : String,
    role : String,
    otp : String,
    // isApproved:{
    //     type:Boolean,
    //     default:false
    // },
    isVerified:{
        type:Boolean, 
        default:false
    },
    building : {
        type:String,
        //required:true
    },
    locality:{
        type:String,
        //required:true
    },
    city:{
        type:String,
        //required:true
    },
    state:{
        type:String,
        //required:true
    },
    pinCode:{
        type:String,
        //required:true
    },
    country:{
        type:String,
        //required:true
    },
    location:{
        type:{
            type : String,
            //required : true,
            //enum : ['Point']
        },
        coordinates: {      
            //required : true,
            type : [Number]       //geoSpatial data
        }
    }
},{ timestamps : true })

const User = model('User',userSchema)

module.exports = User