const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/register', clinicianController.registerPatient)
clinicianRouter.post('/register', clinicianController.insertPatient)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianById)
clinicianRouter.post('/', clinicianController.insertClinician)

module.exports = clinicianRouter