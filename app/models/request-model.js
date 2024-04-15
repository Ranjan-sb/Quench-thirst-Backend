const mongoose = require('mongoose')
const { Schema, model } = mongoose

const requestSchema = new Schema({
  customerId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  vehicleTypeId : {
    "type" : Schema.Types.ObjectId,
    "ref" : 'VehicleType'
  },
  customerAddress : String,
  orderType : String,
  quantity : Number,
  orderDate : Date,
  purpose : String,
  status :{
    type: String,
    default: 'pending'
  },
  supplierId : {
    type : Schema.Types.ObjectId,
    ref : 'Supplier'
  },
  suppliers : [{
    supplierId : Schema.Types.ObjectId,
    email : String
  }]
}, {timestamps:true})

const Request=model('Request', requestSchema)

module.exports=Request