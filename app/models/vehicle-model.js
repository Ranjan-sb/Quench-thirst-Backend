const mongoose=require('mongoose')

const {Schema, model}=mongoose

const vehicleSchema=new Schema({
  supplierId : Schema.Types.ObjectId,
  vehicleNumber : String,
  vehicleTypeId : Schema.Types.ObjectId,
  capacity : String
},{timestamps:true})

const Vehicle=model('Vehicle', vehicleSchema)

module.exports=Vehicle
