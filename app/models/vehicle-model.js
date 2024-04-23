const mongoose=require('mongoose')

const {Schema, model}=mongoose

const vehicleSchema=new Schema({
  supplierId : {
    type : Schema.Types.ObjectId,
    ref : 'Supplier'
  },
  vehicleNumber : String,
  vehicleTypeId : {
    type : Schema.Types.ObjectId,
    ref : 'VehicleType'
  }
},{timestamps:true})

const Vehicle=model('Vehicle', vehicleSchema)

module.exports=Vehicle
