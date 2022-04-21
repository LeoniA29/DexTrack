const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

// sample patient routes
patientRouter.get('/', patientController.getAllPatients)
patientRouter.get('/:patient_id', patientController.getPatientById)
patientRouter.post('/', patientController.insertPatient)

patientRouter.post('/:patient_id', patientController.insertPatientData)



// export the router
module.exports = patientRouter
