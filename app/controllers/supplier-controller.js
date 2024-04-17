const Supplier = require('../models/supplier-model')
const User=require('../models/user-model')
const axios = require('axios')
//const Address = require('../models/address-model')
const _ = require("lodash")
const { validationResult } = require('express-validator')

const supplierController = {}

supplierController.list = async (req,res)=>{
    try{
        const supplier = await Supplier.find({isApproved : true}).sort({createdAt:-1}).populate('userId',['username','email','mobileNumber'])
        res.json(supplier)
    } catch(err){
        res.status(500).json({error:'Internal Server Error'})
    }
}

supplierController.yetToApprove=async(req,res)=>{
    try{
        const suppliers= await Supplier.find({isApproved:false})
        res.json(suppliers)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

supplierController.approveSupplier = async(req,res)=>{
    const {id} = req.params
    try{
        const supplier = await Supplier.findById(id)
        if(!supplier){
            return res.status(404).json({ message: 'Supplier not found' }) 
        }
        const supplierNew = await Supplier.findByIdAndUpdate(id,{$set :{isApproved:true}},{new:true})
        res.json(supplierNew)
        
    } catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
}

supplierController.account = async (req,res)=>{
    try {
        const supplier = await Supplier.findOne({userId:req.user.id})//.populate('userId',['username','email','mobileNumber']).select({password:0})
        res.json(supplier)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

supplierController.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    try{
        const supplier = new Supplier(body)
        const addressBody = _.pick(req.body,['building','locality','city','state','pinCode','country'])
        const searchString = `${addressBody.building}${addressBody.locality}${addressBody.city}${addressBody.state}${addressBody.pinCode}${addressBody.country}`
        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        if(mapResponse.data.features.length==0){
           return  res.status(400).json({errors:[{msg:"Invalid address",path:'invalid address'}]})
        }
        const location = [mapResponse.data.features[0].properties.lon,mapResponse.data.features[0].properties.lat]
        supplier.location.coordinates = location
        supplier.userId = req.user.id
        await supplier.save()
        res.status(201).json(supplier)
    } catch (err){
        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }
}

supplierController.remove = async (req, res) => {
    try {
        const {id} = req.params
        const supplier = await Supplier.findByIdAndDelete(id)
        if (!supplier) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(supplier)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    supplierController
}