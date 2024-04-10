const VehicleType=require('../models/vehicleType-model')

const vehicleTypeValidation={
  name:{
    notEmpty:{
      errorMessage:'vehicle name is required'
    }
  },
  quantity:{
    notEmpty:{
      errorMessage:'quantity cannot be zero or empty'
    },
    isNumeric:{
      errorMessage:'quantity should be in numbers'
    }
  },
  prices:{
    isArray:{
      errorMessage:'prices should be an array'
    },
    custom:{
      option: function (value){
        if(value.length==0){
          throw new Error('prices should not be empty')
        }
        value.forEach(ele=>{
          if(Object.values(ele).length==0){
            throw new Error('prices cannot be empty')
          }
        })
        return true
      }
    }
  } 
}

module.exports=vehicleTypeValidation