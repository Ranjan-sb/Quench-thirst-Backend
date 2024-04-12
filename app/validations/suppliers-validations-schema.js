const suppliersValidationSchema={
  userId:{
    notEmpty:{
      errorMessage:'userId is required'
    },
    isMongoId:{
      errorMessage:'userId should be valid'
    }
  },
  licenseNumber:{
    notEmpty:{
      errorMessage:'licenseNumber is required'
    },
    isAlphaNumeric:{
      errorMessage:'license Number should contain only letters and digits'
    }
  },
  'accHolderName.bankAcc':{
    notEmpty:{
      errorMessage:'name is required'
    }
  },
  'bank.bankAcc':{
    notEmpty:{
      errorMessage:'bank name is required'
    }
  },
  'accNum.bankAcc':{
    notEmpty:{
      errorMessage:'accNum is required'
    }
  },
  'IFSC.bankAcc':{
    notEmpty:{
      errorMessage:'IFSC code is required'
    },
    isAlphaNumeric:{
      errorMessage:'IFSC should be alpha-numeric'
    }
  },
  'branch.bankAcc':{
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