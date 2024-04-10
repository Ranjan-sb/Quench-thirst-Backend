const mongoose=require('mongoose')
const {Schema, model}=mongoose

const addressSchema = new Schema({
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  doorNo : {
    type:String,
    required:true
  },
  locality:{
     type:String,
     required:true
  },
  city:{
     type:String,
     required:true
  },
  state:{
     type:String,
     required:true
  },
  pinCode:{
     type:String,
     required:true
  },
  country:{
     type:String,
     required:true
  },
  location:{
      type:{
         type:String,
         required:true,
         enum:['Point']
      },
      coordinates: {      
         required:true,
         type:[Number]       //geoSpatial data
      }
  }
},{timestamps:true})

const Address=model('Address', addressSchema)

module.exports=Address