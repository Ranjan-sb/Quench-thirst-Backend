const mongoose=require('mongoose')
const {Schema, model}=mongoose

const paymentSchema=new Schema({
  orderId:{
    type : Schema.Types.ObjectId,
    ref : 'Order'
  },
  transactionId : Schema.Types.ObjectId,
  paymentStatus : String,
  paymentType : String,
  amount : Number
},{timestamps:true})

const Payment=model('Payment', paymentSchema)

module.exports=Payment