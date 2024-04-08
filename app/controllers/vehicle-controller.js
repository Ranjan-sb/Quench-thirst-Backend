const Vehicle = require('../models/vehicle-model')
const vehicleType = require('../models/vehicleType-model')
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
        vehicle.vehicleTypeId = await vehicleType.findById(id)
        vehicle.save()
        res.status(201).json(vehicle)
    } catch(error){
        console.log(error)
        res.status(500).json({error : "Internal Server Error"})
    }
}

module.exports = vehicleController