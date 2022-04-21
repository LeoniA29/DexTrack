const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 input_data: String,
 comment: String,
 entry_type: {
     type: String,
     enum: ['glucose', 'weight', 'insulin', 'steps']
 }
 
})

const PatientData = mongoose.model('PatientData', schema)
module.exports = PatientData