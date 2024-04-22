require('dotenv').config()
const mongoose = require('mongoose')

const configureDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.DB_LINK)
        console.log('Successfully Connected to db')
    } catch(error) {
        console.log('error connecting to db : ',error)
    }
}

module.exports = configureDB