const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

// sample clinician routes
clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianById)
clinicianRouter.post('/', clinicianController.insertClinician)


// export the router
module.exports = clinicianRouter
