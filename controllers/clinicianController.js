const Clinician = require('../models/clinician')
const Patient = require('../models/patient')

const getAllClinicians = async (req, res, next) => {
 try {
 const clinicians = await Clinician.find().lean()
 return res.render('allClinicians', { data: clinicians })
 } catch (err) {
 return next(err)
 }
}

const getClinicianById = async(req, res, next) => {
 try {
 const clinician = await Clinician.findById(req.params.clinician_id).lean()
 if (!clinician) {
 // no author found in database
 return res.sendStatus(404)
 }
 // found person
 return res.render('oneData', { oneItem: clinician })
 } catch (err) {
 return next(err)
 }
}

const insertClinician= (req, res) => {
    var newData = new Clinician(req.body)
    /* use validation in-between */
    newData.save()    
    return res.redirect('back')
}

// trying to insertPatient into database
const insertPatient = (req, res) => {
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
    getClinicianById,
    getAllClinicians,
    insertClinician,
    insertPatient,
    registerPatient,
}


   
