const paymentValidationSchema={
  orderId:{
    notEmpty:{
      errorMessage:'order Id is required'
    },
    isMongoId:{
      errorMessage:'valid order Id is required'
    }
  },
  transactionId:{
    notEmpty:{
      errorMessage:'transaction Id is required'
    },
    isMongoId:{
      errorMessage:'valid transaction Id is required'
    }
  },
  paymentStatus:{
    notEmpty:{
      errorMessage:'status is required'
    },
    isIn:{
      options:[['pending','success','failure']],
      errorMessage:'status should be amongst the options'
    }
  },
  paymentType:{
    notEmpty:{
      errorMessage:'payment type is required'
    },
    isIn:{
      options:[['cash','card','upi']],
      errorMessage:'please select anyone from the options'
    }
  },
  amount:{
    notEmpty:{
      errorMessage:'amount is required'
    },
    isNumeric:{
      errorMessage:'amount should be in numbers'
    }
  }
}
module.exports=paymentValidationSchema