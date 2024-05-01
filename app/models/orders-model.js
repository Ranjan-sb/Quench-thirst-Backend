const mongoose = require('mongoose')

const {Schema, model} = mongoose

const orderSchema = new Schema({
  supplierId : {
    type : Schema.Types.ObjectId,
    ref : 'Supplier'
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
  // assignTo : {
  //   type : Schema.Types.ObjectId,
  //   ref : 'Vehicle'
  // },
  requestId : {
    type : Schema.Types.ObjectId,
    ref : 'Request'
  }
},{timestamps:true})

const Order = model('Order', orderSchema)

module.exports = Order