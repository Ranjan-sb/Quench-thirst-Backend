const mongoose = require('mongoose')
const { Schema, model } = mongoose

const paymentSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  transactionId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'Successful', 'Failed'],
    default: "pending"
  },
  paymentType: String,
  amount: Number
}, { timestamps: true })

const Payment = model('Payment', paymentSchema)

module.exports = Payment