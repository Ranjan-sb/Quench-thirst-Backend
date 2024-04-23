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