const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 patient_list: [ObjectId]
})

const Clinician = mongoose.model('Clinician', schema)
module.exports = Clinician