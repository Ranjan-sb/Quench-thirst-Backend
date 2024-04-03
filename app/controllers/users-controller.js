require('dotenv').config()
const User = require('../models/user-model')
const { validationResult } = require('express-validator')

const nodemailer = require('nodemailer')

const usersController = {}

usersController.sendConfirmMail = (recipientMail, recipientUsername) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "adarshcoding32@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const html = `
    <p><b>Hi ${recipientUsername},</b><br />Thankyou for registering to quenchThirst App</p>
    `
    async function mailSend() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'adarshcoding32@gmail.com', // sender address
            to: recipientMail,
            subject: "Registration Confirmation", // Subject line
            html: html, // html body
        });
    }
    mailSend().catch(console.error)
}


usersController.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const user = new User(body)
        const count = await User.find().countDocuments()
        if (count === 0) {
            user.role = 'admin'
            user.isApproved = true
        }
        if (user.role.toLowerCase() === 'customer'){
            user.isApproved = true
        }
        await user.save()
        res.status(201).json(user)
        usersController.sendConfirmMail(user.email, user.username)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}



// usersController.login = async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }
//     try {
//         const body = req.body
//         const user = await User.findOne({ mobileNumber: body.mobileNumber })
//         if (!user) {
//             return res.status(404).json({ error: 'Invalid Mobile Number' })
//         }
//         const accountSid = process.env.TWILIO_ACCOUNT_SID;
//         const authToken = process.env.TWILIO_AUTH_TOKEN;
//         const twilioPhoneNumber = 'TWILIO_PHONE_NUMBER';
//         const client = require('twilio')(accountSid, authToken);

//         // Route to handle OTP generation and sending
//         app.post('/send-otp', (req, res) => {
//             const { mobileNumber } = req.body;

//             // Generate a random 6-digit OTP
//             const otp = Math.floor(100000 + Math.random() * 900000);

//             // Send OTP to the provided phone number using Twilio
//             client.messages
//                 .create({
//                     body: `Your OTP is: ${otp}`,
//                     from: twilioPhoneNumber,
//                     to: mobileNumber
//                 })
//                 .then(message => {
//                     console.log('OTP sent:', message.sid);
//                     res.status(200).send({ success: true, message: 'OTP sent successfully' });
//                 })
//                 .catch(err => {
//                     console.error('Error sending OTP:', err);
//                     res.status(500).send({ success: false, message: 'Failed to send OTP' });
//                 });
//         });

//         // Route to handle OTP verification
//         app.post('/verify-otp', (req, res) => {
//             const { otp, enteredOtp } = req.body;

//             // Compare OTP entered by the user with the generated OTP
//             if (otp === enteredOtp) {
//                 res.status(200).send({ success: true, message: 'OTP verification successful' });
//             } else {
//                 res.status(400).send({ success: false, message: 'Incorrect OTP' });
//             }
//         });


//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// }

usersController.read = async(req,res)=>{
    try {
        const users = await User.find().sort({createdAt:-1})
        res.status(200).json(users)
    } catch(error){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

usersController.account = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id)//.select({password:0})
        res.json(user)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

usersController.approveSupplier = async(req,res)=>{
    const {id} = req.params
    try{
        const supplier = await User.findById(id)
        if(!supplier){
            return res.status(404).json({ message: 'Supplier not found' }) 
        }
        supplier.isApproved = true
    } catch(error){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = {
    usersController
}