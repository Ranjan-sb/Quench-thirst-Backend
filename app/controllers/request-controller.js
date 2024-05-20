const { validationResult } = require('express-validator')
const { isPointWithinRadius } = require('geolib')
const Request = require('../models/request-model')
const Supplier = require('../models/supplier-model')
const Order = require('../models/orders-model')
const User = require('../models/user-model')
const nodemailer = require('nodemailer')

const requestController = {}

let deletionTimeout;

// Function to delete requests after 30 minutes and notify customers
async function deleteRequestsAndNotify() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const requestsToDelete = await Request.find({ $or: [{ supplierId: null }, { status: 'pending' }], createdAt: { $lte: thirtyMinutesAgo } });

    for (const request of requestsToDelete) {
      // Notify the customer that the request has been deleted
      const user = await User.findById(request.customerId);
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        }
      });

      const html = `<p><b>Hi ${user.username},</b><br />Your request created at ${request.createdAt} which was of type : ${request.orderType} having ${request.quantity} quantity of ${request.vehicleTypeId?.name} has been automatically deleted as no supplier accepted it within 30 minutes.</p>`;

      transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender email address
        to: user.email,
        subject: "Request Deleted", // Subject line
        html: html, // html body
      });
      console.log("Mail sent to:", user.email)
      // Delete the request from the database
      await Request.findByIdAndDelete(request._id);
    }
  } catch (error) {
    console.error('Error deleting requests:', error);
  }
}

// Function to start the deletion process
function startDeletionProcess() {
  // Cancel previous timeout if any
  clearTimeout(deletionTimeout);

  // Start the deletion process
  deleteRequestsAndNotify();

  // Schedule the next deletion after 30 minutes
  deletionTimeout = setTimeout(startDeletionProcess, 30 * 60 * 1000);
}

requestController.create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const body = req.body
  try {
    const request = new Request(body)
    const searchDistance = 10 * 1000
    const transformCoordinates = (coordinates) => {
      return { latitude: coordinates[1], longitude: coordinates[0] }
    }
    const user1 = await User.findById(req.user.id)
    //request.customerEmail = user1.email
    request.customerAddress = `${user1.building} ${user1.locality} ${user1.city} ${user1.pinCode}`
    const customerCoordinates = user1.location.coordinates

    //console.log("customer-cor", customerCoordinates)
    const suppliers = await Supplier.find({ isApproved: true }).populate('userId', ['email', '_id'])//.populate('userId',['email'])
    console.log("1-", suppliers)
    const filteredSuppliers = suppliers.filter(ele => {
      const transformedSupplierCoordinates = {
        latitude: ele.location.coordinates[0],
        longitude: ele.location.coordinates[1]
      };

      console.log("ele", transformedSupplierCoordinates);

      return isPointWithinRadius(transformedSupplierCoordinates, transformCoordinates(customerCoordinates), searchDistance)

      //isPointWithinRadius({latitude:42.24222,longitude:12.32452},{latitude:20.24222,longitude:11.32452},radius in m )
      //isPointWithinRadius(point,center point,distance from center point)
    })
    console.log("customer-cord", transformCoordinates(customerCoordinates))
    console.log("filteredsuplist", filteredSuppliers)
    if (filteredSuppliers) {
      let emailArr = []
      for (let i = 0; i < filteredSuppliers.length; i++) {
        emailArr.push(filteredSuppliers[i].userId)
      }
      //console.log("emailArr",emailArr)
      const newData = emailArr.map((ele) => ({
        supplierId: ele._id,
        email: ele.email
      }))
      request.suppliers = newData


      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        }
      });

      const html = `<p><b>Hi,</b><br />There is a new request. Please Accept or Reject the request</p>`
      async function mailSend() {
        for (const email of emailArr) {
          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, // sender email address
            to: email,
            subject: "Request for tanker", // Subject line
            html: html, // html body
          });
        }
      }
      //--------------------------------->Don't forget to uncomment this
      mailSend().catch(console.error)
    }
    //request.suppliers = emailArr
    if (request.status === 'pending') {
      request.supplierId = null
    }
    request.customerId = req.user.id
    if (body.orderType === 'immediate') {
      request.orderDate = new Date()
    } else if (body.orderType === 'advance') {
      request.orderDate = body.orderDate  //from postman- yyyy-mm-dd
    }
    await request.save()

    // Start the deletion process
    startDeletionProcess();

    const requestNew = await Request.findById(request._id).populate('vehicleTypeId')
    res.status(201).json(requestNew)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

requestController.list = async (req, res) => {
  const orderTypeSearch = req.query.orderTypeSearch || ''
  const purposeSearch = req.query.purposeSearch || ''
  const sortBy = req.query.sortBy || 'orderType'
  const order = req.query.order || 1
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  // console.log("search1-",orderTypeSearch)
  // console.log("search2-",purposeSearch)
  const sortQuery = {}
  sortQuery[sortBy] = order === 'asc' ? 1 : -1
  page = parseInt(page)
  limit = parseInt(limit)
  try {
    const totalCount = await Request.countDocuments({
      customerId: req.user.id,
      orderType: { $regex: orderTypeSearch, $options: 'i' },
      purpose: { $regex: purposeSearch, $options: 'i' }
    })

    const totalPages = Math.ceil(totalCount / limit)

    const requests = await Request
      .find({
        customerId: req.user.id,
        status: 'pending',
        orderType: { $regex: orderTypeSearch, $options: 'i' },
        purpose: { $regex: purposeSearch, $options: 'i' }
      })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vehicleTypeId', ['name']);
    res.json(
      {
        requests:requests,
        totalPages:totalPages
      }
    )
    // console.log('request123', requests)
    // res.json(requests)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

//code for updating request to be written if necessary

requestController.accepted = async (req, res) => {
  try {
    const id = req.params.id
    const request = await Request.findByIdAndUpdate(id, { $set: { supplierId: req.user.id, status: 'accepted' } }, { new: true }).populate('vehicleTypeId').populate('customerId')
    console.log("reuest =-----",request)
    const lineItemsArray = []
    lineItemsArray.push({
      'quantity': request.quantity,
      'orderType': request.orderType, 'purpose': request.purpose, 'vehicleTypeId': request.vehicleTypeId
    })
    console.log("vehicleTypeId", request.vehicleTypeId._id)
    console.log(lineItemsArray)

    const user = await User.findOne({ _id: request.customerId })
    const order = new Order()
    order.supplierId = req.user.id
    order.customerId = request.customerId
    order.orderDate = request.orderDate
    order.lineItems = lineItemsArray
    order.requestId = id
    let totalPrice = 0
    lineItemsArray.forEach(item => {
      // Find the price for the specified purpose in the vehicle type prices
      const priceInfo = item.vehicleTypeId.prices.find(price => price.purpose === item.purpose);
      console.log("---priceInfo----",priceInfo)
      if (priceInfo) {
        // Add the calculated price to the total
        totalPrice += priceInfo.price * item.quantity;
        console.log("--tp--",totalPrice)
      }
    }) 
    order.price = totalPrice

    const from = new Date(request.orderDate).setHours(0,0,0,0)
    const to = new Date(request.orderDate).setHours(23,59,59,999)
    const recordCount = await Order.find({supplierId:req.user.id,orderDate:{$gte : from ,$lte :to}})//.countDocuments()//,orderDate:request.orderDate,'lineItems[0].purpose':request.purpose
    order.tokenNumber = recordCount.length + 1
    if(recordCount.length === 0){
      order.currentTokenNumber = 0
    }else{
      order.currentTokenNumber=recordCount[0].currentTokenNumber
    }
    await order.save()


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const html = `<p><b>Hi,</b><br />Your Order has been accepted by a supplier</p>`
    async function mailSend() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender email address
        to: user.email,
        subject: "Request for tanker", // Subject line
        html: html, // html body
      });
    }
    mailSend().catch(console.error)

    const orderData = await Order.findOne({ requestId: request._id }).populate('supplierId').populate('customerId').populate({
      path: 'lineItems',
      populate: {
        path: 'vehicleTypeId',
        model: 'VehicleType'
      }
    });
    res.json([request, orderData])
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

requestController.getRequestsOfSupplier = async (req, res) => {
  const orderTypeSearch = req.query.orderTypeSearch || ''
  const purposeSearch = req.query.purposeSearch || ''
  const sortBy = req.query.sortBy || 'orderType'
  const order = req.query.order || 1
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  // console.log("search1-",orderTypeSearch)
  // console.log("search2-",purposeSearch)
  const sortQuery = {}
  sortQuery[sortBy] = order === 'asc' ? 1 : -1
  page = parseInt(page)
  limit = parseInt(limit)
  try {
    const totalCount = await Request.countDocuments({
      'suppliers.supplierId': req.user.id,
      supplierId: null,
      orderType: { $regex: orderTypeSearch, $options: 'i' },
      purpose: { $regex: purposeSearch, $options: 'i' }
    })

    const totalPages = Math.ceil(totalCount / limit)

    const requests = await Request
      .find({ 'suppliers.supplierId': req.user.id, 
        supplierId: null,
        orderType: { $regex: orderTypeSearch, $options: 'i' },
        purpose: { $regex: purposeSearch, $options: 'i' } })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('vehicleTypeId', ['name'])
      .populate('customerId', ['email'])
    //console.log(req.user.id)
    //console.log(requests)
    console.log('suppliers_reqs-',{requests, totalPages})
    res.json({
      requests,
      totalPages
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}



requestController.remove = async (req, res) => {
  const { id } = req.params
  try {
    //supplierId
    const request = await Request.findOneAndDelete({ _id: id, customerId: req.user.id })
    res.json(request)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

requestController.reject = async (req, res) => {
  const requestId = req.params.id;
  const supplierId = req.user.id; // Assuming you have authentication middleware to get the user ID

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if the supplier is assigned to the request
    const supplierIndex = request.suppliers.findIndex(supplier => supplier.supplierId.toString() === supplierId);
    if (supplierIndex === -1) {
      return res.status(403).json({ error: 'You are not assigned to this request' });
    }

    // Remove the supplier from the suppliers list
    request.suppliers.splice(supplierIndex, 1);
    await request.save();

    res.json({supplierId :req.user.id,requestId:request._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = requestController

