const Vehicle = require("../models/vehicle-model")

const vehicleValidationSchema={
  vehicleNumber:{
    notEmpty:{
      errorMessage:'vehicle number is required'
    },
    isLength:{
      options:{
        max:10
      },
      errorMessage:'vehicle number cannot be more than 10 characters'
    },
    custom:{
      options: async(value)=>{

        const regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
            if (!regex.test(value)) {
                throw new Error('Vehicle number format is invalid');
            }

        const vehicleNum=await Vehicle.findOne({vehicleNumber:value})
        if(!vehicleNum){
          return true
        }else{
          throw new Error('Vehicle Number is already present')
        }
      }
    }
  },
  vehicleTypeId:{
    notEmpty:{
      errorMessage:'vehicle type Id is required'
    },
    isMongoId:{
      errorMessage:'valid Id is required'
    }
  }
}

module.exports=vehicleValidationSchema