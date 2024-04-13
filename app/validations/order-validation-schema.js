const orderValidationSchema={
  supplierId:{
    notEmpty:{
      errorMessage:'supplier Id is required'
    },
    isMongoId:{
      errorMessage:'valid Id is required'
    }
  },
  userId:{
    notEmpty:{
      errorMessage:'user Id is required'
    },
    isMongoId:{
      errorMessage:'valid Id is required'
    }
  },
  orderDate:{
    notEmpty:{
      errorMessage:'order date is required'
    },
    isDate:{
      errorMessage:'date is required'
    }
  },
  // lineItems:{
  //   notEmpty:{
  //     errorMessage:'line items are required'
  //   },
  //   isArray:{
  //     errorMessage:'line items should be an array'
  //   }
  // },
  // price:{
  //   notEmpty:{
  //     errorMessage:'price is required'
  //   },
  //   isNumeric:{
  //     errorMessage:'price should be in numbers'
  //   }
  // },
  // status:{
  //   notEmpty:{
  //     errorMessage:'status is required'
  //   },
  //   isIn:{
  //     options:[['completed','incomplete']],
  //     errorMessage:'status should be amongst the status'
  //   }
  // }
}

module.exports=orderValidationSchema