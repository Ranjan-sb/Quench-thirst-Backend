const { validationResult } = require('express-validator')
const Order = require('../models/orders-model')
const Request = require('../models/request-model')
const ordersController = {}
  
// ordersController.create = async(req,res)=>{
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()})
//     }
//     try{
//         const {id} = req.params
//         const {body} = req
//         const lineItemsArray = []
//         const requestData = await Request.findById(id).populate('vehicleTypeId')
//         lineItemsArray.push({'quantity' : requestData.quantity,
//     'orderType' : requestData.orderType,'purpose' : requestData.purpose,'vehicleTypeId' : requestData.vehicleTypeId})
//         //console.log(lineItemsArray)
//         const order = new Order(body)
//         order.supplierId = req.user.id
//         order.customerId = requestData.customerId
//         order.orderDate = requestData.orderDate
//         order.lineItems = lineItemsArray
//         order.requestId = id
//         let totalPrice = 0
//         lineItemsArray.forEach(item => {
//             // Find the price for the specified purpose in the vehicle type prices
//             const priceInfo = item.vehicleTypeId.prices.find(price => price.purpose === item.purpose);
//             if (priceInfo) {
//               // Add the calculated price to the total
//               totalPrice += priceInfo.price * item.quantity;
//             }
//           })
//         order.price = totalPrice
//         await order.save()
//         res.status(201).json(order)
//     } catch(error){
//         console.log(error)
//         res.status(500).json({error:"Internal Server Error"})
//     }
// }

ordersController.listOrderSupplier = async(req,res)=>{
    try{
        const orders = await Order.find({supplierId:req.user.id}).populate('customerId')
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
        console.log("orders 1-",orders[0].lineItems)
        if(orders){
            console.log(orders.lineItems)
        }
        res.json(orders)    
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}
module.exports = ordersController

// supplierId : {
//     type : Schema.Types.ObjectId,
//     ref : 'Supplier'
//   },
//   customerId : {
//     type : Schema.Types.ObjectId,
//     ref : 'User'
//   },
//   orderDate : Date,
//   lineItems : [String],
//   price : Number,
//   status : [String],
//   assignTo : {
//     type : Schema.Types.ObjectId,
//     ref : 'Vehicle'
//   },
//   requestId : {
//     type : Schema.Types.ObjectId,
//     ref : 'Request'
//   }