const mongoose=require('mongoose')
const {Schema, model}=mongoose

const supplierSchema=new Schema({
  // name:String,
  // mobile:String,
  userId : {
    type : Schema.Types.ObjectId ,
    ref : 'User'
  } ,
  licenseNumber : String,
  address : String,
  geo : {
    lat : String, 
    lng : String
  },
  bankAcc:{
    accHolderName : String,
    bank : String,
    accNum : String,
    IFSC : String,
    branch : String
  }
},{timestamps:true})

const Supplier = model('Supplier', supplierSchema)

module.exports = Supplier