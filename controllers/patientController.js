<<<<<<< HEAD
<<<<<<< HEAD
const Patient = require('../models/patient')
const PatientData = require('../models/patientData')

const getAllPatients = async (req, res, next) => {
    try {
    const patients = await Patient.find().lean()
    return res.render('allPatients', { data: patients })
    } catch (err) {
    return next(err)
    }
   }

const insertPatientData= (req, res) => {
    var newData = new PatientData(req.body)
    /* use validation in-between */
    newData.save()    
    return res.redirect('back')
}

const insertPatient= (req, res) => {
    var newData = new Patient(req.body)
    /* use validation in-between */
    newData.save()    
    return res.redirect('back')
}

const getPatientById = async(req, res, next) => {
    try {
    const patient = await Patient.findById(req.params.patient_id).lean()
    if (!patient) {
    // no author found in database
    return res.sendStatus(404)
    }
    // found person
    return res.render('oneData', { oneItem: patient })
    } catch (err) {
    return next(err)
    }
   }
   
// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
    insertPatient,
    insertPatientData,
    getPatientById
}


   
=======
=======
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
// import patient model
const Patient = require('../models/Patient')

// handle request to get all people data instances
const getAllPatientData = async (req, res, next) => {
    try {
        const patientList = await Patient.find().lean()
        return res.render('allData', { data: patientList })
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.Patient_id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

// trying to insertData into database
const insertData = (req, res) => {
    var newPatient = new Patient(req.body)
    newPatient.save()
    return res.redirect('back')
}

// render register patient hbs
const registerPatient = (req, res) => {
    return res.render('patientRegister')
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getDataById,
    insertData,
    registerPatient,
}
<<<<<<< HEAD
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
=======
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
