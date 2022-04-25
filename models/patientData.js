const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    entry: String, 
    comment: String, 
    data_type: String, 
    createdAt:{type: Date, default: Date.now}
})

const PatientData = mongoose.model('PatientData', schema)
module.exports = PatientData