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
    }
}

module.exports = {
    userRegisterSchema
}