const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import clinician controller functions
const clinicianController = require('../controllers/clinicianController')

// clinician routes used
clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/:clinician_id/register', clinicianController.registerPatient)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianPatientList)
clinicianRouter.post('/', clinicianController.insertClinician)
clinicianRouter.post('/:clinician_id/register', clinicianController.insertPatient)

// export the router
module.exports = clinicianRouter
