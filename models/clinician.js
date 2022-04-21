const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 patient_list: Array,
})

const Clinician = mongoose.model('Clinician', schema)
module.exports = Clinician

// register a new patient and that patient will belong to them