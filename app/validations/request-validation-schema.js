const requestValidationSchema={
  // supplierId:{
  //   notEmpty:{
  //     errorMessage:'supplierId is required'
  //   },
  //   isMongoId:{
  //     errorMessage:'valid supplierId is required'
  //   }
  // },
  // userId:{
  //   notEmpty:{
  //     errorMessage:'userId is required'
  //   },
  //   isMongoId:{
  //     errorMessage:'valid userId is required'
  //   }
  // },
  // addressId:{
  //   notEmpty:{
  //     errorMessage:'addressId is required'
  //   },
  //   isMongoId:{
  //     errorMessage:'valid addressId is required'
  //   }
  // },
  quantity:{
    notEmpty:{
      errorMessage:'quantity is required'
    },
    isNumeric:{
      errorMessage:'quantity should be in numbers'
    }
  },
  orderType:{
    notEmpty:{
      errorMessage:'order type is required'
    },
    isIn:{
      options:[['immediate','advance']],
      errorMessage:'order type should be amongst the options'
    }
  },
  orderDate:{
  //   // notEmpty:{
  //   //   errorMessage:'order date is required'
  //   // }
    isDate:{
      errorMessage:'date should be valid'
    },
    custom:{
      options: (value,{req})=>{
        if(req.orderType==='immediate'){
          return new Date()
        }else if(req.orderType==='advance'){
          const orderDate= new Date(value)
          const today=new Date()
          if(orderDate<=today){
            throw new Error('orderDate should be in future')
          }
          return value
        }
      }
    }
  },
  purpose:{
    notEmpty:{
      errorMessage:'purpose is required'
    },
    isIn:{
      options:[['domestic','commercial','construction','priority']],
      errorMessage:'purpose should be selected amongst the options'
    }
  },
  // status:{
  //   // notEmpty:{
  //   //   errorMessage:'status is required'
  //   // },
  //   isIn:{
  //     options:[['pending','accepted']],
  //     errorMessage:'status should be selected amongst the options'
  //   }
  // }
}

module.exports=requestValidationSchema