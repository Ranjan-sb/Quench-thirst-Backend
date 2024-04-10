const { validationResult } = require('express-validator')
const Request=require('../models/request-model')
const Address=require('../models/address-model')

const requestController={}

requestController.create=async(req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const body=req.body
  try{
    const request= new Request(body)
    const address= await Address.findOne({userId : req.user.id}).populate('userId',['doorNo','locality','city','state','pincode','country'])
    request.addressId=address
    request.customerId=req.user.id
    if(body.orderType==='immediate'){
      request.orderDate=new Date()
    }else if(body.orderType==='advance'){
      request.orderDate=body.orderDate  
    }
    await request.save()
    res.status(201).json(request)

  }catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server Error'})
  }
}

requestController.list = async(req,res)=>{
  try{
    const requests = await Request.find()
    res.json(requests)
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Internal Server Error"})
  } 
}

requestController.remove = async(req,res)=>{
  const {id} = req.params
  try{
    const request = await Request.findByIdAndDelete(id)
    res.json(request)
  } catch(error){
    console.log(error)
    res.status(500).json({error : "Internal Server Error"})
  } 
}

module.exports=requestController