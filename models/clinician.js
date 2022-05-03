const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
<<<<<<< HEAD

//const Patient_List = require('./Patient')



/*
const patientList = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
})
*/
=======
const { ObjectId } = require('mongodb')
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003

const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 patient_list: [ObjectId]
})

const Clinician = mongoose.model('Clinician', schema)
module.exports = Clinician