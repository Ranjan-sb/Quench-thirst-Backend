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

const {userRegisterSchema,verifyEmailAndOtpValidationSchema,forgotPasswordValidation,resendOTPEmailValidationSchema,loginValidationSchema, updatingPassword} = require('./app/validations/user-validation-schema')
const {usersController} = require('./app/controllers/users-controller')

const {authenticateUser,authorizeUser} = require('./app/middlewares/auth')
const { supplierController } = require('./app/controllers/supplier-controller')

const vehicleTypeController = require('./app/controllers/vehicleType-controller')

const vehicleController = require('./app/controllers/vehicle-controller')
const requestController = require('./app/controllers/request-controller')
const requestValidationSchema = require('./app/validations/request-validation-schema')

const ordersController = require('./app/controllers/orders-controller')
const paymentController = require('./app/controllers/payment-controller')
const vehicleTypeValidation = require('./app/validations/vehiclesType-validation-schema')
const vehicleValidationSchema = require('./app/validations/vehicles-validations-schema')
const suppliersValidationSchema = require('./app/validations/suppliers-validations-schema')



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

//route to delete user
app.delete('/api/users/:id', authenticateUser, usersController.remove)


//route to see particular user or account
app.get('/api/users/account',authenticateUser,usersController.account)

//route to get all users
app.get('/api/users',authenticateUser,authorizeUser(['admin']),usersController.read)


//SUPPLIER MODULE------------------------------------------------------------------------------>

//route to create supplier
app.post('/api/suppliers',authenticateUser,authorizeUser(['supplier']),checkSchema(suppliersValidationSchema),supplierController.create)

//route to list suppliers
app.get('/api/suppliers',authenticateUser,authorizeUser(['admin','customer']),supplierController.list)

//route to approve supplier by admin
app.put('/api/suppliers/:id/approve',authenticateUser,authorizeUser(['admin']),supplierController.approveSupplier)

// route to get particular supplier
app.get('/api/suppliers/account',authenticateUser,supplierController.account)

//route to delete supplier
app.delete('/api/suppliers/:id',authenticateUser,authorizeUser(['admin']),supplierController.remove)

//route for suppliers mapping within the radius
app.get('/api/suppliers/co',authenticateUser,authorizeUser(['customer','supplier']),supplierController.findByLatAndLng)

//vehicle type module ------------------------------------------------------------------------->

//route to list all vehicleType
app.get('/api/vehicleType',authenticateUser,authorizeUser(['admin','supplier','customer']),vehicleTypeController.list)

//route to list particular vehicleType
app.get('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin','supplier']),vehicleTypeController.particularType)



//route to create vehicleType
app.post('/api/vehicleType',authenticateUser,authorizeUser(['admin']),checkSchema(vehicleTypeValidation),vehicleTypeController.create)

//route to update vehicleType
app.put('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin']),checkSchema(vehicleTypeValidation),vehicleTypeController.update)

//route to delete vehicleType
app.delete('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin']),vehicleTypeController.remove)

//------------------------------------------------------------------------------------------------------------------>

//route to create vehicle
app.post('/api/vehicles',authenticateUser,authorizeUser(['supplier']),checkSchema(vehicleValidationSchema),vehicleController.create)

//list all vehicles of supplier
app.get('/api/vehicles',authenticateUser,authorizeUser(['supplier']),vehicleController.list)

//route to list particular vehicle
app.get('/api/vehicles/:id',authenticateUser,authorizeUser(['supplier']),vehicleController.particularVehicle)

//route to update vehicle
app.put('/api/vehicles/:id',authenticateUser,authorizeUser(['supplier']),checkSchema(vehicleValidationSchema),vehicleController.update)

//route to delete vehicle
app.delete('/api/vehicles/:id',authenticateUser,authorizeUser(['supplier']),vehicleController.remove)


//------------------------------------------------------------------------------------------------------------------>

//route to create request
app.post('/api/requests',authenticateUser,authorizeUser(['customer']),checkSchema(requestValidationSchema), requestController.create)

//accept a request by supplier
app.put('/api/requests/:id/accept',authenticateUser,authorizeUser(['supplier']),requestController.accepted)

//route to get requests for particular supplier
app.get('/api/requests/suppliers/my',authenticateUser,authorizeUser(['supplier']),requestController.getRequestsOfSupplier)

//route to see request
app.get('/api/requests',authenticateUser,authorizeUser(['customer']),requestController.list)

//route to delete requests
app.delete('/api/requests/:id',authenticateUser,authorizeUser(['customer']),requestController.remove)

//------------------------------>

//route to list orders of supplier
app.get('/api/orders/supplier',authenticateUser,authorizeUser(['supplier']),ordersController.listOrderSupplier)

//route to list orders of customer
app.get('/api/orders/customer',authenticateUser,authorizeUser(['customer']),ordersController.listOrderCustomer)

//route to set isFulfilled by Supplier
app.put('/api/orders/:id/fulfilled',authenticateUser,authorizeUser(['supplier']),ordersController.setFulfilled)

//------------------------------------------------------------------------------------------------------->

//route to make payment
app.post('/api/create-checkout-session',paymentController.create)
app.put('/api/payments/:id/success',paymentController.successUpdate)
app.put('/api/payments/:id/failed',paymentController.failedUpdate)


app.listen(port,()=>{
    console.log("server running on port : ",port)
})