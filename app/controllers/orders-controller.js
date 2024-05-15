const { validationResult } = require('express-validator')
const Order = require('../models/orders-model')
const ordersController = {}

ordersController.listOrderSupplier = async(req,res)=>{
    try{
        const orders = await Order.find({supplierId:req.user.id}).populate('supplierId').populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        }).sort({createdAt:1});
        res.json(orders)
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

ordersController.listOrderCustomer = async(req,res)=>{
    try{
        const orders = await Order.find({customerId:req.user.id}).populate('supplierId').populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });

        //console.log("orders 1-",orders[0].lineItems)
        if(orders){
            console.log("order.lineitems:",orders.lineItems)
        }
        res.json(orders)    
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

ordersController.setFulfilled = async(req,res)=>{
    try{
        const id = req.params.id
        const order = await Order.findOneAndUpdate({_id:id, supplierId:req.user.id},{$set :{isFulfilled:true}},{new:true})
       
        const from = new Date(order.orderDate).setHours(0,0,0,0)
        const to = new Date(order.orderDate).setHours(23,59,59,999)
        const searchQuery = {supplierId:req.user.id,orderDate:{$gte : from ,$lte :to}}
        
        // const recordCount = await Order.find({supplierId:req.user.id,orderDate:{$gte : from ,$lte :to}}).countDocuments()//,orderDate:request.orderDate,'lineItems[0].purpose':request.purpose
        // order.tokenNumber = recordCount + 1
        const orderUpdate = await Order.updateMany(searchQuery,{$set:{currentTokenNumber:order.tokenNumber}},{new:true})

        res.json(order)
    } catch(error){
        console.log(error)
    }
}
module.exports = ordersController
