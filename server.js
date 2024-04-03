const express = require('express')
const cors = require('cors')
const app = express()
const {checkSchema} = require('express-validator')
const port = 3100

app.use(cors())
app.use(express.json())

const configureDB = require('./config/dbConfig')
configureDB()

const {userRegisterSchema} = require('./app/validations/user-validation-schema')
const {usersController} = require('./app/controllers/users-controller')

const {authorizeUser} = require('./app/middlewares/auth')
const { supplierController } = require('./app/controllers/supplier-controller')

//route to create/register user
app.post('/api/users/register',checkSchema(userRegisterSchema),usersController.register)

//route to login
//app.post('/api/users/login',checkSchema(userLoginSchema),usersController.login)

//route to see particular user or account
//app.post('/api/users/account', authenticateUser, usersController.account)
app.get('/api/users/account',checkSchema(userRegisterSchema),usersController.account)

//route to get all users
app.get('/api/users',usersController.read)

//route to approve supplier by admin
app.put('/api/users/:id/approve',authorizeUser(['admin']),usersController.approveSupplier)

//SUPPLIER MODULE------------------------------------------------------------------------------>

//route to create supplier
app.post('/api/suppliers',supplierController.create)
//route to list suppliers
app.get('/api/suppliers',supplierController.list)
// rote to get particular file
app.get('/api/suppliers/account',supplierController.account)



app.listen(port,()=>{
    console.log("server running on port : ",port)
})