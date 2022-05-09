const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

//const Patient_List = require('./Patient')



/*
const patientList = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
})
*/

const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 role: {
     type: String,
     default: "clinician"
 },
 patient_list: [ObjectId]
})

const Clinician = mongoose.model('Clinician', schema)
module.exports = Clinician