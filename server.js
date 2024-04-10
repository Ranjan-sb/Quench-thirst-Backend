const express = require('express')
const cors = require('cors')
const app = express()
const {checkSchema} = require('express-validator')
const port = 3100
const User =require('./app/models/user-model')

app.use(cors())
app.use(express.json())

const configureDB = require('./config/dbConfig')
configureDB()

const {userRegisterSchema,verifyEmailAndOtpValidationSchema,forgotPasswordValidation,resendOTPEmailValidationSchema,loginValidationSchema} = require('./app/validations/user-validation-schema')
const {usersController} = require('./app/controllers/users-controller')

const {authenticateUser,authorizeUser} = require('./app/middlewares/auth')
const { supplierController } = require('./app/controllers/supplier-controller')

const vehicleTypeController = require('./app/controllers/vehicleType-controller')

const vehicleController = require('./app/controllers/vehicle-controller')
const requestController = require('./app/controllers/request-controller')
const requestValidationSchema = require('./app/validations/request-validation-schema')

//route to create/register user
app.post('/api/users/register',checkSchema(userRegisterSchema),usersController.register)

//route to verify email & otp
app.post('/api/users/verifyEmail',checkSchema(verifyEmailAndOtpValidationSchema), usersController.verifyEmailAndOtp)

//route for forgot password -> mail and otp and new password 
app.put('/api/users/forgotPassword', checkSchema(forgotPasswordValidation),usersController.forgotPassword )

//for reverification of email while login if not verified and for forgot password mail to verify mail
app.post('/api/users/reverifyEmail',checkSchema(resendOTPEmailValidationSchema) ,usersController.resendOTP)

//route to login
app.post('/api/users/login',checkSchema(loginValidationSchema),usersController.login)

//route to update user
//app.put('/api/users', authenticateUser , usersController.update)

//route to delete user
app.delete('/api/users/:id', authenticateUser, usersController.remove)


//route to see particular user or account
//app.post('/api/users/account', authenticateUser, usersController.account)
app.get('/api/users/account',authenticateUser,usersController.account)

//route to get all users
app.get('/api/users',authenticateUser,authorizeUser(['admin']),usersController.read)

//route to approve supplier by admin
app.put('/api/users/:id/approve',authenticateUser,authorizeUser(['admin']),usersController.approveSupplier)

//SUPPLIER MODULE------------------------------------------------------------------------------>

//route to create supplier
app.post('/api/suppliers',authenticateUser,supplierController.create)

//route to list suppliers
app.get('/api/suppliers',authenticateUser,authorizeUser(['admin']),supplierController.list)

// route to get particular supplier
app.get('/api/suppliers/account',authenticateUser,supplierController.account)

//route to delete supplier
app.delete('/api/suppliers',authenticateUser,supplierController.remove)

//vehicle type module ------------------------------------------------------------------------->

//route to list all vehicleType
app.get('/api/vehicleType',authenticateUser,authorizeUser(['admin','supplier']),vehicleTypeController.list)

//route to list particular vehicleType
app.get('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin','supplier']),vehicleTypeController.particularType)

//route to create vehicleType
app.post('/api/vehicleType',authenticateUser,authorizeUser(['admin']),vehicleTypeController.create)

//route to update vehicleType
app.put('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin']),vehicleTypeController.update)

//route to delete vehicleType
app.delete('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin','supplier']),vehicleTypeController.remove)

//------------------------------------------------------------------------------------------------------------------>

//route to create vehicle
app.post('/api/vehicles',authenticateUser,authorizeUser(['supplier']),vehicleController.create)

//list all vehicles of supplier
app.get('/api/vehicles',authenticateUser,authorizeUser(['supplier']),vehicleController.list)

//route to list particular vehicle
app.get('/api/vehicles/:id',authenticateUser,authorizeUser(['supplier']),vehicleController.particularVehicle)

//route to update vehicle
app.put('/api/vehicles/:id',authenticateUser,authorizeUser(['supplier','admin']),vehicleController.update)

//route to delete vehicleType
app.delete('/api/vehicles/:id',authenticateUser,authorizeUser(['admin','supplier']),vehicleTypeController.remove)

//------------------------------------------------------------------------------------------------------------------>

//route to create request
app.post('/api/requests',authenticateUser,authorizeUser(['customer']),checkSchema(requestValidationSchema), requestController.create)

//route to delete request
app.get('/api/requests',authenticateUser,authorizeUser(['customer','admin']),requestController.list)

//route to delete requests
app.delete('/api/requests/:id',authenticateUser,authorizeUser(['customer','admin']),requestController.remove)





app.listen(port,()=>{
    console.log("server running on port : ",port)
})