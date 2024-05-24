const { validationResult } = require('express-validator')
const Order = require('../models/orders-model')
const ordersController = {}

ordersController.listOrderSupplier = async(req,res)=>{
    let page = req.query.page || 1
    let limit = req.query.limit || 10
    const sortBy = req.query.sortBy || 'orderDate'
    const order = req.query.order || 1
    const sortQuery = {}
    sortQuery[sortBy] = order === 'asc' ? 1 : -1
    page = parseInt(page)
    limit = parseInt(limit) 
    try{
        const totalCount = await Order.countDocuments({
            supplierId:req.user.id
          })
      
        const totalPages = Math.ceil(totalCount / limit)

        const orders = await Order
            .find({supplierId:req.user.id})
            .populate('supplierId')
            .populate('customerId')
            .populate({
                        path: 'lineItems',
                        populate: {
                            path: 'vehicleTypeId',
                            model: 'VehicleType'
                        }
            })
            // .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            orders,
            totalPages
        })

    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

ordersController.listOrderCustomer = async(req,res)=>{
    try{
        const orders = await Order.find({customerId:req.user.id,status:"incomplete"}).populate('supplierId').populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });

        //console.log("orders 1-",orders[0].lineItems)
        // if(orders){
        //     console.log("order.lineitems:",orders.lineItems)
        // }
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

ordersController.customerPreviousOrder = async(req,res)=>{
    try{
        const orders = await Order.find({customerId:req.user.id, status:"completed"}).populate('supplierId').populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });
        res.json(orders)
    }catch(error){
        console.log(error)
    }
}

ordersController.supplierPreviousOrder = async(req,res)=>{
    try{
        const orders = await Order.find({supplierId:req.user.id, status:"completed"}).populate('supplierId').populate('customerId').populate({
            path: 'lineItems',
            populate: {
                path: 'vehicleTypeId',
                model: 'VehicleType'
            }
        });
        res.json(orders)
    }catch(error){
        console.log(error)
    }
}
module.exports = ordersController
