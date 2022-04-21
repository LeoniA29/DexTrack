const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// sample patient routes
patientRouter.get('/', patientController.getAllPatients)
patientRouter.get('/:patient_id', patientController.getPatientById)

module.exports = patientRouter