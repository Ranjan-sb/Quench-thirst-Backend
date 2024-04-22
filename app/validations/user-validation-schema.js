const User = require('../models/user-model')

const userRegisterSchema = {
    username : {
        notEmpty : {
            errorMessage : 'username is a required field'
        },
        custom : { 
            //custom validation - business logic
            options : async function(value){
                const user = await User.findOne({username:value})
                if(!user){
                    return true
                } else{
                    throw new Error('username already exists')
                }
            }
        },
        trim : true
    },
    email : {
        notEmpty : {
            errorMessage : 'email is a required field'
        },
        isEmail : {
            errorMessage : 'email should be in valid format'
        },
        custom : { 
            //custom validation - business logic
            options : async function(value){
                const user = await User.findOne({email : value})
                if(!user){
                    return true
                } else {
                    throw new Error('Email already exists')
                }
            }
        },
        normalizeEmail  : true
    },
    mobileNumber : {
        notEmpty : {
            errorMessage : 'mobileNumber is a required field'
        }
    },
    role : {
        notEmpty : {
            errorMessage : 'role is a required field'
        },
        isIn : {
            options : [['admin','supplier','customer']],
            errorMessage : 'role should be Admin, Supplier or Customer'
        }
    },
    // building:{
        // notEmpty:{
        //     errorMessage:"Building cannot be empty."
        // },
        // isLength:{
        //     options:{
        //         min:2,
        //     },
        //     errorMessage:"At least 2 characters required."
        // }
    //     custom:{
    //         options:async function (value, {req}){
    //             try{
    //                 if(req && req.role && req.role.includes('admin') || req.role.includes('customer')){
    //                     if(!value || value.trim()==''){
    //                         throw new Error('buliding details required')
    //                     }
    //                 }
    //                 return true
    //             }catch(err){
    //                 throw new Error(err.message)
    //             }
    //         }
    //     }
    // },
    // locality:{
    //     notEmpty:{
    //         errorMessage:"locality cannot be empty."
    //     },
    //     isLength:{
    //         options:{min:2},
    //         errorMessage:"At least 2 characters required."
    //     }
    // },
    // city:{
    //     notEmpty:{
    //         errorMessage:"city cannot be empty."
    //     },
    //     isLength:{
    //         options:{min:2},
    //         errorMessage:"At least 2 characters required."
    //     }
    // },
    // state:{
    //     notEmpty:{
    //         errorMessage:"state cannot be empty."
    //     },
    //     isLength:{
    //         options:{min:2},
    //         errorMessage:"At least 2 characters required."
    //     }
    // },
    // pinCode:{
    //     notEmpty:{
    //         errorMessage:"pinCode cannot be empty."
    //     },
    //     isLength:{
    //         options:{min:2},
    //         errorMessage:"At least 2 characters required."
    //     }
    // },
    // country:{
    //     notEmpty:{
    //         errorMessage:"country cannot be empty."
    //     },
    //     isLength:{
    //         options:{min:2},
    //         errorMessage:"Atleast 2 characters required."
    //     }
    // }
}

const verifyEmailAndOtpValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    otp: {
        exists: {
            errorMessage: 'otp field is required'
        },
        notEmpty: {
            errorMessage: 'otp field must have some value'
        },
        trim: true,
        isLength: {
            options: { min: 6, max: 6 },
            errorMessage: 'otp field value must be of 6 digits'
        },
        isNumeric: {
            errorMessage: 'otp value must be numbers only'
        }
    }
}

//for forgot password 
const forgotPasswordValidation = {
    email:{
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    otp: {
        exists: {
            errorMessage: 'otp field is required'
        },
        notEmpty: {
            errorMessage: 'otp field must have some value'
        },
        trim: true,
        isLength: {
            options: { min: 6, max: 6 },
            errorMessage: 'otp field value must be of 6 digits'
        },
        isNumeric: {
            errorMessage: 'otp value must be numbers only'
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        }
        // isLength: {
        //     options: { min: 8, max: 128 },
        //     errorMessage: 'password field value must be between 8-128 characters'
        // },
        // isStrongPassword: {
        //     errorMessage: 'password must have at least one uppercase, one number and one special character'
        // }
    }
}

const updatingPassword = {
    oldPassword: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        }
        // isLength: {
        //     options: { min: 8, max: 128 },
        //     errorMessage: 'password field value must be between 8-128 characters'
        // }
        // isStrongPassword: {
        //     errorMessage: 'password must have atleast one uppercase, one number and one special character'
        // }
    },
    newPassword:{
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        }
        // isLength: {
        //     options: { min: 8, max: 128 },
        //     errorMessage: 'password field value must be between 8-128 characters'
        // },
        // isStrongPassword: {
        //     errorMessage: 'password must have atleast one uppercase, one number and one special character'
        // }
    }
}


//for resending otp
const resendOTPEmailValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    }
}

const loginValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        }
        // isLength: {
        //     options: { min: 8, max: 128 },
        //     errorMessage: 'password field value must be between 8-128 characters'
        // }
    }
}
module.exports = {
    userRegisterSchema,
    verifyEmailAndOtpValidationSchema,
    forgotPasswordValidation,
    updatingPassword,
    loginValidationSchema,
    resendOTPEmailValidationSchema
}