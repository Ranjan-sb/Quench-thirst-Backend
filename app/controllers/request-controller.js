const { validationResult } = require('express-validator')
const {isPointWithinRadius} = require('geolib')
const Request = require('../models/request-model')
const Supplier = require('../models/supplier-model')
const User = require('../models/user-model')
const nodemailer = require('nodemailer')

const requestController={}

requestController.create=async(req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const body=req.body
  try{
    const request = new Request(body)
    const searchDistance = 10
    const transformCoordinates=(coordinates)=>{
      return { latitude:coordinates[1] ,longitude:coordinates[0] }
    }
    const user1 = await User.findById(req.user.id)
    request.customerAddress = `${user1.building} ${user1.locality} ${user1.city} ${user1.pinCode}`
    const customerCoordinates = user1.location.coordinates
    const suppliers = await Supplier.find().populate('userId',['email','_id'])//.populate('userId',['email'])
    //console.log(suppliers)
    const filteredSuppliers = suppliers.filter(ele=>{
      return isPointWithinRadius(transformCoordinates(ele.location.coordinates),transformCoordinates(customerCoordinates),searchDistance)
                        //isPointWithinRadius({latitude:42.24222,longitude:12.32452},{latitude:20.24222,longitude:11.32452},radius in m )
                        //isPointWithinRadius(point,center point,distance from center point)
        })          
    console.log(filteredSuppliers)
    if(filteredSuppliers){
      let emailArr = []
      for(let i = 0; i < filteredSuppliers.length; i++){
        emailArr.push(filteredSuppliers[i].userId)
      }
      console.log("emailArr",emailArr)
      request.suppliers = emailArr

      
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        }
      });
  
      const html = `<p><b>Hi,</b><br />There is a new request. Please Accept or Reject the request</p>`
      async function mailSend() {
        for(const email of emailArr){
        // send mail with defined transport object
          const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, // sender email address
            to: email,
            subject: "Request for tanker", // Subject line
            html: html, // html body
          });
        } 
      }
      //--------------------------------->Don't forget to uncomment this
      mailSend().catch(console.error)
    }
    //request.suppliers = emailArr
    if(request.status === 'pending'){
      request.supplierId = null
    }
    request.customerId = req.user.id
    if(body.orderType==='immediate'){
      request.orderDate=new Date()
    }else if(body.orderType==='advance'){
      request.orderDate=body.orderDate  
    }
    await request.save()
    res.status(201).json(request)

  }catch(error){
    console.log(error)
    res.status(500).json({error:'Internal Server Error'})
  }
}

requestController.list = async(req,res)=>{
  try{
    const requests = await Request.find({customerId:req.user.id})
    res.json(requests)
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Internal Server Error"})
  } 
}

//code for updating request to be written if necessary


requestController.accepted = async(req,res)=>{
  try{
    id = req.params.id
    const request = await Request.findByIdAndUpdate(id,{$set :{supplierId:req.user.id,status:'accepted'}},{new:true})
    res.json(request)
  } catch(error){
    console.log(error)
    res.status(500).json({error:'Internal Server Error'})
  }
}



requestController.remove = async(req,res)=>{
  const {id} = req.params
  try{
    const request = await Request.findByIdAndDelete(id,{customerId:req.user.id})
    res.json(request)
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Internal Server Error"})
  } 
}

module.exports=requestController