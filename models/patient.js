const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 first_name: String,
 last_name: String
})

const Patient = mongoose.model('Patient', schema)
module.exports = Patient