const mongoose = require('mongoose')
const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 dob: Date,
 address: String,
 email: String,
 screen_name: String,
 short_bio: String,
 data_inputs: Array
})

const Patient = mongoose.model('Patient', schema)
module.exports = Patient