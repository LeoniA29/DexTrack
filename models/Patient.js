const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
    screenName: { type: String, required: true },
    shortBio: String,
    patientData: Array
})

const Patient = mongoose.model('Patient', schema)
module.exports = Patient


