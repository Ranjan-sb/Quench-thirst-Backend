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
app.delete('/api/vehicleType/:id',authenticateUser,authorizeUser(['admin']),vehicleTypeController.remove)

//------------------------------------------------------------------------------------------------------------------>

//route to create vehicle
app.post('/api/vehicles',authenticateUser,authorizeUser(['supplier']),vehicleController.create)

// // Route to handle OTP generation and sending
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = 'TWILIO_PHONE_NUMBER';
// const client = require('twilio')(accountSid, authToken);
// app.post('/api/send-otp', async(req, res) => {

//     const { mobileNumber } = req.body;
//     try{
//         const user = await User.findOne({mobileNumber})
//         console.log(user)
//         if(user){
//             // Generate a random 6-digit OTP
//             function generateOtp(){
//                 const generatedOtp = Math.floor(100000 + Math.random() * 900000);
//                 user.otp = generatedOtp
//                 return generateOtp
//             }
            
//             await user.save()
//         }else{
//             res.send({message:'User Not found'})
//         }
//     }catch(error){
//         console.log(error)
//     }
    

//     // Send OTP to the provided phone number using Twilio
//     client.messages
//         .create({
//             body: `Your OTP is: ${generateOtp()}`,
//             from: twilioPhoneNumber,
//             to: 9066901674
//         })
//         .then(message => {
//             console.log('OTP sent:', message.sid);
//             res.status(200).send({ success: true, message: 'OTP sent successfully' });
//         })
//         .catch(err => {
//             console.error('Error sending OTP:', err);
//             res.status(500).send({ success: false, message: 'Failed to send OTP' });
//         });
// });

// // Route to handle OTP verification
// app.post('/api/verify-otp', async(req, res) => {
//     const { mobileNumber, enteredOtp } = req.body;
//     try{
//         const user = await User.find({mobileNumber})
//         if(user){
//             // Compare OTP entered by the user with the generated OTP
//             if (user.otp === enteredOtp) {
//                 res.status(200).send({ success: true, message: 'OTP verification successful' });
//             } else {
//                 res.status(400).send({ success: false, message: 'Incorrect OTP' });
//             }
//         }
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error:"Internal Server error"})
//     }
// });




app.listen(port,()=>{
    console.log("server running on port : ",port)
})