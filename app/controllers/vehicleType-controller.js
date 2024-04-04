const VehicleType = require('../models/vehicleType-model')
const { validationResult } = require('express-validator')

const vehicleTypeController = {}

vehicleTypeController.list = async(req,res)=>{
    try{
        const vehicles = await VehicleType.find().sort({createdAt:-1})
        res.json(vehicles)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

vehicleTypeController.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const {body} = req
        const vehicle = new VehicleType(body)
        await vehicle.save()
        res.status(200).json(vehicle)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

vehicleTypeController.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const {id} = req.params
        const {body} = req
        const vehicle = await VehicleType.findOneAndUpdate({id}, body , {new:true})
        await vehicle.save()
        res.status(200).json(vehicle)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

vehicleTypeController.particularType = async (req,res)=>{
    try {
        const {id} = req.params
        const vehicle = await VehicleType.findById(id)
        res.json(vehicle)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

vehicleTypeController.remove = async (req, res) => {
    try {
        const {id} = req.params
        const vehicle = await VehicleType.findByIdAndDelete(id)
        if (!vehicle) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(vehicle)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = vehicleTypeController