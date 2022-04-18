const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: String,
    address: String,
    dob: Date,
    email: String,
    screenName: { type: String, required: true },
    shortBio: String,
    patientData: Array
})
const Patient = mongoose.model('Patient', schema)
module.exports = Patient


