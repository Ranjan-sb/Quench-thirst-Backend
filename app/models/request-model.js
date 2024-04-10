const mongoose = require('mongoose')
const {Schema, model}=mongoose

const requestSchema=new Schema({
  customerId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  addressId : {
    type : Schema.Types.ObjectId,
    ref : 'Address'
  },
  orderType : [String],
  quantity : Number,
  orderDate : Date,
  purpose : [String],
  status : [String],
  supplierId : {
    type : Schema.Types.ObjectId,
    ref : 'Supplier'
  }
}, {timestamps:true})

const Request=model('Request', requestSchema)

module.exports=Request