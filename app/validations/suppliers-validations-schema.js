const Supplier = require("../models/supplier-model")

const suppliersValidationSchema={
  // userId:{
  //   notEmpty:{
  //     errorMessage:'userId is required'
  //   },
  //   isMongoId:{
  //     errorMessage:'userId should be valid'
  //   }
  // },
  licenseNumber:{
    notEmpty:{
      errorMessage:'licenseNumber is required'
    },
    isAlphaNumeric:{
      errorMessage:'license Number should contain only letters and digits'
    },
    custom:{
      options : async function(value){
        const supplier = await Supplier.findOne({licenseNumber:value})
        console.log("license-",supplier)
        if(!supplier){
            return true
        } else{
            throw new Error('license Number already exists')
        }
      }
    }    
  },
  accHolderName:{
    notEmpty:{
      errorMessage:'name is required'
    }
  },
  bank:{
    notEmpty:{
      errorMessage:'bank name is required'
    }
  },
  accNum:{
    notEmpty:{
      errorMessage:'accNum is required'
    },
    custom:{
      options : async function(value){
        const accountNo = await Supplier.findOne({accNum:value})
        console.log("accountNo-",accountNo)
        if(!accountNo){
            return true
        } else{
            throw new Error('Account Number already exists')
        }
      }
    }
  },
  IFSC:{
    notEmpty:{
      errorMessage:'IFSC code is required'
    },
    isAlphaNumeric:{
      errorMessage:'IFSC should be alpha-numeric'
    }
  },
  branch:{
    notEmpty:{
      errorMessage:'branch name is required'
    }
  },
  building:{
        notEmpty:{
            errorMessage:"Building cannot be empty."
        },
        isLength:{
            options:{
                min:2,
            },
            errorMessage:"At least 2 characters required."
        }
  },
  locality:{
      notEmpty:{
          errorMessage:"locality cannot be empty."
      },
      isLength:{
          options:{min:2},
          errorMessage:"At least 2 characters required."
      }
  },
  city:{
      notEmpty:{
          errorMessage:"city cannot be empty."
      },
      isLength:{
          options:{min:2},
          errorMessage:"At least 2 characters required."
      }
  },
  state:{
      notEmpty:{
          errorMessage:"state cannot be empty."
      },
      isLength:{
          options:{min:2},
          errorMessage:"At least 2 characters required."
      }
  },
  pinCode:{
      notEmpty:{
          errorMessage:"pinCode cannot be empty."
      },
      isLength:{
          options:{min:2},
          errorMessage:"At least 2 characters required."
      }
  },
  country:{
      notEmpty:{
          errorMessage:"country cannot be empty."
      },
      isLength:{
          options:{min:2},
          errorMessage:"At least 2 characters required."
      }
  }
}
module.exports=suppliersValidationSchema