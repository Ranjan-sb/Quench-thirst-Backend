const vehicleValidationSchema={
  // supplierId:{
  //   notEmpty:{
  //     errorMessage:'supplier Id is required'
  //   },
  //   isMongoId:{
  //     errorMessage:'valid Id is required'
  //   }
  // },
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
  },
  capacity:{
    notEmpty:{
      errorMessage:'capacity is required'
    },
    isIn:{
      options:[['small(6000L)','medium(8000L)','large(10000L)']],
      errorMessage:'capacity should be amongst the options'
    }
  }
}

module.exports=vehicleValidationSchema