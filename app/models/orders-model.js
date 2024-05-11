const mongoose = require('mongoose')

const {Schema, model} = mongoose

const orderSchema = new Schema({
  supplierId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  customerId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  orderDate : Date,
  lineItems : [{
    quantity : Number,
    orderType : String,
    purpose : String,
    vehicleTypeId : {
      type : Schema.Types.ObjectId,
      ref : 'VehicleType'
    }
  }],
  price : Number,
  status : {
    type : String,
    default : "incomplete"
  },
  requestId : {
    type : Schema.Types.ObjectId,
    ref : 'Request'
  },
  isFulfilled : {
    type : Boolean,
    default : false
  },
  tokenNumber : {
    type : Number,
    required: false
  },
  currentTokenNumber : {
    type : Number,
    required : false
  }
},{timestamps:true})

const Order = model('Order', orderSchema)

module.exports = Order