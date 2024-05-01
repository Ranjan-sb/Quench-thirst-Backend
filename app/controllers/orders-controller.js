const { validationResult } = require('express-validator')
const Order = require('../models/orders-model')
const Request = require('../models/request-model')
const ordersController = {}

ordersController.listOrderSupplier = async(req,res)=>{
    try{
        const orders = await Order.find({supplierId:req.user.id}).populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });
        res.json(orders)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

ordersController.listOrderCustomer = async(req,res)=>{
    try{
        const orders = await Order.find({customerId:req.user.id}).populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });
        res.json(orders)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}
module.exports = ordersController
