const mongoose=require('mongoose')
const {Schema, model}=mongoose

const requestSchema=new Schema({
  customerId:Schema.Types.ObjectId,
  addressId:Schema.Types.ObjectId,
  quantity:[String],
  orderDate:Date,
  purpose:[String],
  status:[String],
  supplierId:Schema.Types.ObjectId
}, {timestamps:true})

const Request=model('Request', requestSchema)

module.exports=Request