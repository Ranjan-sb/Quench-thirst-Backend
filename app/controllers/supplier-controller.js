const Supplier = require('../models/supplier-model')
const { validationResult } = require('express-validator')

const supplierController = {}

supplierController.list = async (req,res)=>{
    try{
        const supplier = await Supplier.find().sort({createdAt:-1}).populate('userId',['username','email','mobileNumber'])
        res.json(supplier)
    } catch(err){
        res.status(500).json({error:'Internal Server Error'})
    }
}

supplierController.account = async (req,res)=>{
    try {
        //dont forget to change to (req.user.id)
        const supplier = await Supplier.findById("660d388f5884aa28da759204").populate('userId',['username','email','mobileNumber'])//(req.user.id)//.select({password:0})
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
    const {body}=req
    try{
        const supplier = new Supplier(body)
        supplier.userId = "660d237e44033ada93ab39fa"
        await supplier.save()
        res.status(201).json(supplier)
    } catch (err){
        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }
}

module.exports = {
    supplierController
}