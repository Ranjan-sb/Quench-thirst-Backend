const User = require('../models/user-model')
const Supplier = require('../models/supplier-model')
const axios = require('axios')
const _ = require("lodash")
const { validationResult } = require('express-validator')
const {isPointWithinRadius} = require('geolib')

const reverseLatLon=(arr)=>{
    return [arr[1], arr[0]]
}


const supplierController = {}

supplierController.list = async (req,res)=>{
    const search=req.query.search ||''
    const sortBy=req.query.sortBy || ''
    const order=req.query.order || 1
    let page=req.query.page || 1
    let limit=req.query.limit || 5
    // const searchQuery={username:{$regex:search, $options:'i'}}
    const sortQuery={}
    sortQuery[sortBy]=order==='asc' ? 1 : -1
    page=parseInt(page) 
    limit=parseInt(limit)
    try{
        //const supplier = await Supplier.find({isApproved : true}).sort({createdAt:-1}).populate('userId',['username','email','mobileNumber'])
        const supplier = await Supplier.find()
                                        // .sort(sortQuery)
                                        .skip((page - 1)*limit)
                                        .limit(limit)
                                        .populate('userId',['username','email','mobileNumber'])
        console.log('suppliers-',supplier)
        res.json(supplier)
    } catch(err){
        res.status(500).json({error:'Internal Server Error'})
    }
}

supplierController.approveSupplier = async(req,res)=>{
    const {id} = req.params
    try{
        const supplier = await Supplier.findByIdAndUpdate(id,{$set :{isApproved:true}},{new:true})
        res.json(supplier)
    } catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
}

supplierController.account = async (req,res)=>{
    try {
        const supplier = await Supplier.findOne({userId:req.user.id})
        res.json(supplier)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

supplierController.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    try{
        const supplier = new Supplier(body)
        const addressBody = _.pick(req.body,['building','locality','city','state','pinCode','country'])
        const searchString = `${addressBody.building}${addressBody.locality}${addressBody.city}${addressBody.state}${addressBody.pinCode}${addressBody.country}`
        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        if(mapResponse.data.features.length==0){
           return  res.status(400).json({errors:[{msg:"Invalid address",path:'invalid address'}]})
        }
        const location = [mapResponse.data.features[0].properties.lon,mapResponse.data.features[0].properties.lat]
        supplier.location.coordinates = reverseLatLon(location)
        // supplier.location.coordinates =location
        console.log("suppliers reversed coordinates-",supplier.location.coordinates)

        supplier.userId = req.user.id
        await supplier.save()
        res.status(201).json(supplier)
    } catch (err){
        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }
}

supplierController.remove = async (req, res) => {
    try {
        const {id} = req.params
        const supplier = await Supplier.findByIdAndDelete(id)
        if (!supplier) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(supplier)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const transformToObj = (coordinates) => {
    return { latitude: coordinates[0], longitude: coordinates[1] }
}

supplierController.findByLatAndLng=async(req,res)=>{
    
    // const {lat, lon}= req.query
    const radius=10
    // const centerCoordinates={
    //     latitude:lat,
    //     longitude: lon
    // }
    // console.log("1-",centerCoordinates)
    try{
        const customer=await User.findById(req.user.id)
        if(customer){
            const centerCoordinates=reverseLatLon(customer.location.coordinates)
            console.log("customer center-",centerCoordinates)

            const suppliersLocation= await Supplier.find({isApproved:true})
                const filteredSuppliers=suppliersLocation.filter((ele)=>{
                console.log("2-",ele.location.coordinates)
                // const r={
                //     latitude: parseFloat(centerCoordinates.latitude),
                //     longitude: parseFloat(centerCoordinates.longitude)
                // }
                // console.log("3-",r)
                return isPointWithinRadius(ele.location.coordinates,centerCoordinates, parseFloat(radius*1000))
            })
            console.log("filteredSuppliers-",filteredSuppliers)
            res.json(filteredSuppliers)
        }              
        
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = {
    supplierController
}