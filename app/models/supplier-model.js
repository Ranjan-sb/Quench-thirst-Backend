const mongoose=require('mongoose')
const {Schema, model}=mongoose

const supplierSchema=new Schema({
  userId : {
    type : Schema.Types.ObjectId ,
    ref : 'User'
  } ,
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
         type:String,
         //required:true,
         enum:['Point']
      },
      coordinates: {      
         //required:true,
         type:[Number]       //geoSpatial data
      }
  },
  licenseNumber : String,
  bankAcc:{
    accHolderName : String,
    bank : String,
    accNum : String,
    IFSC : String,
    branch : String
  },
  isApproved:{
   type:Boolean,
   default:false
   }
},{timestamps:true})

const Supplier = model('Supplier', supplierSchema)

module.exports = Supplier