const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')


// sample clinician routes
clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/register', clinicianController.registerPatient)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianById)
clinicianRouter.post('/', clinicianController.insertClinician)
clinicianRouter.post('/register', clinicianController.insertPatient)


// export the router
module.exports = clinicianRouter
