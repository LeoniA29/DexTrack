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


   
