const { validationResult } = require('express-validator')
const Order = require('../models/orders-model')
const Request = require('../models/request-model')
const ordersController = {}

ordersController.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const order = new Order(body)
        // const request = 
        // const body = req.body
        
        order.supplierId = req.user.id

    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

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