const mongoose=require('mongoose')
const {Schema, model}=mongoose

const addressSchema = new Schema({
  userId : Schema.Types.ObjectId,
  address : String,
  geo : {
    lat : String,
    lng : String
  }
},{timestamps:true})

const Address=model('Address', addressSchema)

module.exports=Address