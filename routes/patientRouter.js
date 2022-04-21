const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// sample patient routes
patientRouter.get('/', patientController.getAllPatientData)
patientRouter.get('/:patient_id', patientController.getPatientById)

// export the router
module.exports = patientRouter

