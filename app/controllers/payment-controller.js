const Payment = require('../models/payment-model')
const Order = require('../models/orders-model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//const _ = require('lodash')
const paymentController = {}

paymentController.create = async(req,res)=>{
    // const errors = validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()})
    // }
    const body = req.body
    const orderId = req.query.orderId
    try{
        const order = await Order.findById(orderId)
        console.log(orderId)
        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '570018',
                city: 'Mysore',
                state: 'Karnataka',
                country: 'US',
            },
        })
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:'Water tanker'
                    },
                    unit_amount:order.price * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/failure',
            customer : customer.id
        })
        
        //create a payment
        const payment = new Payment()
        payment.orderId = orderId
        payment.transactionId = session.id
        payment.amount = Number(order.price)
        payment.paymentType = "card"
        await payment.save()
        res.json({id:session.id,url: session.url})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}  

paymentController.successUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const paymentRecord = await Payment.findOne({transactionId:id})
        if(!paymentRecord){
            return res.status(404).json({error:'record not found'})
        }
        //const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, {$set:{paymentStatus:'Successful'}},{new:true})
        const updatedOrder = await Order.findOneAndUpdate({_id:updatedPayment.orderId},{$set:{status:'completed'}},{new:true})
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentController.failedUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const body = pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id},{$set:{paymentStatus:"Failed"}},{new:true}) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
module.exports = paymentController