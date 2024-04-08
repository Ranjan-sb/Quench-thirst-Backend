require('dotenv').config()
const Address = require('../models/address-model')
const _ = require("lodash")
const bcryptjs = require('bcryptjs')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
// const Supplier = require('../models/supplier-model')
const usersController = {}

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid,authToken);

usersController.sendSMS = async(username,mobileNumber,role)=>{
    let msgOptions = {
        from : process.env.TWILIO_PHONE_NUMBER,
        to : "+91"+mobileNumber,
        body : `Hi ${username}, you are now successfully registered to Quench Thirst App with role : ${role.toUpperCase()}`
    };
    try{
        const message = await client.messages.create(msgOptions);
        //console.log(message)
    } catch(error){
        console.log(error)
    }
}

//otp generation
const OTP_LENGTH = 6
const OTP_CONFIG = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
}
const generateOtp = ()=>{
    const otp = otpGenerator.generate(OTP_LENGTH,OTP_CONFIG)
    return otp
}

usersController.sendConfirmMail = (recipientMail, recipientUsername, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const html = `
    <p><b>Hi ${recipientUsername},</b><br />Thankyou for registering to quenchThirst App,<br /> Your OTP is ${otp}</p>
    `
    async function mailSend() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, // sender email address
            to: recipientMail,
            subject: "Registration Confirmation", // Subject line
            html: html, // html body
        });
    }
    mailSend().catch(console.error)
}

//To register a user to QT App
usersController.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const addressBody = _.pick(req.body,['address','geo'])
        const user = new User(body)
        {
            const salt = await bcryptjs.genSalt()
            const encryptedPassword = await bcryptjs.hash(user.password, salt)
            user.password = encryptedPassword
            
        }
        {
            const otp = generateOtp()
            user.otp = otp
            usersController.sendConfirmMail(user.email,user.username ,user.otp)
        }
        const count = await User.find().countDocuments()
        if (count === 0) {
            user.role = 'admin'
            user.isApproved = true
        }
        if (user.role.toLowerCase() === 'customer'){
            user.isApproved = true
        }
        const address = new Address(addressBody)
        address.userId = user._id
        await user.save()
        await address.save()
        res.status(201).json(user)

        //usersController.sendConfirmMail(user.email, user.username)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//to verify the email - otp verification
usersController.verifyEmailAndOtp = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, otp } = _.pick(req.body, ['email', 'otp'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        if (user && user.otp != otp) {
            return res.status(400).json({ error: 'Invalid OTP' })
        }
        await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } }, { new: true })
        res.send('User Verified')
        usersController.sendSMS(user.username,user.mobileNumber,user.role)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//for resending OTP
usersController.resendOTP = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email } = _.pick(req.body, ['email'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        {
            const otp = generateOtp()
            usersController.sendConfirmMail(user.email,user.username, otp)
            await User.findOneAndUpdate({ email: user.email }, { $set: { otp: otp } }, { new: true })
            res.send('Otp ReSend')
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//forgot password
usersController.forgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { email, otp, password } = _.pick(req.body, ['email', 'otp', 'password'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        if (user && user.otp != otp) {
            return res.status(400).json({ error: 'invalid otp' })
        }
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(password, salt)
        await User.findOneAndUpdate({ email: email }, { $set: { password: encryptedPassword } }, { new: true })
        res.send('Password Updated')
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}



//To login to QT-APP
usersController.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const {email,password} = _.pick(req.body, ['email','password'])
        const user = await User.findOne({ email : email })
        if (!user) {
            return res.status(404).json({ error: 'User not present' })
        }
        const checkPassword = await bcryptjs.compare(password,user.password)
        if(!checkPassword){
            res.status(404).json({error:"Invalid email/password"})
        }
        const tokenData = {
            id : user._id,
            role : user.role
        }
        const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'7d'})
        res.json({token:token})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

usersController.read = async(req,res)=>{
    try {
        const users = await User.find().sort({createdAt:-1}).select({password:0,otp:0})
        res.status(200).json(users)
    } catch(error){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

usersController.account = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select({password:0})
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
        const supplierNew = await User.findByIdAndUpdate(id,{$set :{isApproved:true}},{new:true})
        res.json(supplierNew)
        
    } catch(error){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

//to delete the particular user
usersController.remove = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    usersController
}