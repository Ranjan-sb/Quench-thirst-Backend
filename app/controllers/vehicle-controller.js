const Vehicle = require('../models/vehicle-model')
const _ = require('lodash')
//const vehicleType = require('../models/vehicleType-model')
const {validationResult} = require('express-validator')
const vehicleController = {}

vehicleController.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const {body} = req
        const vehicle = new Vehicle(body)
        vehicle.supplierId = req.user.id
        vehicle.save()
        res.status(201).json(vehicle)
    } catch(error){
        console.log(error)
        res.status(500).json({error : "Internal Server Error"})
    }
}

vehicleController.list = async(req,res)=>{
    try{
        const vehicles = await Vehicle.find({supplierId:req.user.id}).sort({createdAt:-1}).populate('vehicleTypeId',['name','prices.purpose','prices.price'])
        console.log(vehicles)
        res.json(vehicles)
    } catch(error){
        console.log(error)
        res.status(500).json({errors : "Internal Server Error"})
    }
}


vehicleController.particularVehicle = async (req,res)=>{
    try {
        const {id} = req.params
        const vehicle = await Vehicle.findById(id).populate('vehicleTypeId',['name','prices.purpose','prices.price'])
        res.json(vehicle)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

vehicleController.remove = async (req, res) => {
    try {
        const {id} = req.params
        const vehicle = await Vehicle.findByIdAndDelete(id)
        if (!vehicle) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(vehicle)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

vehicleController.update = async(req,res)=>{
    try{
        const {id} = req.params
        const body = _.pick(req.body,['vehicleNumber','vehicleTypeId'])
        const newVehicle = await Vehicle.findByIdAndUpdate({_id : id},body,{new:true})
        res.json(newVehicle)
    } catch(error){
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


module.exports = vehicleController