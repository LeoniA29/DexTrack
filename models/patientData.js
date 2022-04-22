const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 input_data: String,
 comment: String, 
})

const PatientData = mongoose.model('PatientData', schema)
module.exports = PatientData