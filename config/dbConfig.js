const mongoose = require('mongoose')

const configureDB = async ()=>{
    try {
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/qt-2024')
        console.log('Successfully Connected to db')
    } catch(error) {
        console.log('error connecting to db : ',error)
    }
}

module.exports = configureDB