const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
})

const Clinician = mongoose.model('Clinician', schema)
module.exports = Clinician
