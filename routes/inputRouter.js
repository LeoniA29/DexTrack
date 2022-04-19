const express = require('express')

// create our Router object
const inputRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

// sample patient routes
inputRouter.get('/patient', patientController.getAllPatients)
inputRouter.get('/patient/:patient', patientController.getPatientById)
inputRouter.post('/patient', patientController.insertPatient)

// sample clinician routes
inputRouter.get('/clinician', clinicianController.getAllClinicians)
inputRouter.get('/clinician/:clinician_id', clinicianController.getClinicianById)
inputRouter.post('/clinician', clinicianController.insertClinician)


// export the router
module.exports = inputRouter
