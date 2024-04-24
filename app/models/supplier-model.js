const mongoose = require('mongoose')
const { Schema, model } = mongoose

const supplierSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   building: {
      type: String,
   },
   locality: {
      type: String,
   },
   city: {
      type: String,
   },
   state: {
      type: String,
   },
   pinCode: {
      type: String,
   },
   country: {
      type: String,
   },
   location: {
      type: {
         type: String
      },
      coordinates: {
         type: [Number]       //geoSpatial data
      }
   },
   licenseNumber: String,
   accHolderName: String,
   bank: String,
   accNum: String,
   IFSC: String,
   branch: String,
   isApproved: {
      type: Boolean,
      default: false
   }
}, { timestamps: true })

const Supplier = model('Supplier', supplierSchema)

module.exports = Supplier

//abcderwef