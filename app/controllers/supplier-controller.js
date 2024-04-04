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
    const {body}=req
    try{
        const supplier = new Supplier(body)
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