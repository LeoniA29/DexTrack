const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

<<<<<<< HEAD
// import clinician controller functions
const clinicianController = require('../controllers/clinicianController')

// clinician routes used
clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/:clinician_id/register', clinicianController.registerPatient)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianPatientList)
clinicianRouter.post('/', clinicianController.insertClinician)
clinicianRouter.post('/:clinician_id/register', clinicianController.insertPatient)
=======
// import people controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

// sample clinician routes
clinicianRouter.get('/', clinicianController.getAllClinicians)
clinicianRouter.get('/:clinician_id', clinicianController.getClinicianById)
clinicianRouter.post('/', clinicianController.insertClinician)

>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003

// export the router
module.exports = clinicianRouter
