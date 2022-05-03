const express = require('express')

// create our Router object
const patientRouter = express.Router()

<<<<<<< HEAD
// import patient controller functions
const patientController = require('../controllers/patientController')


// patient routes used
patientRouter.get('/', patientController.getAllPatients) // remove later
=======
// import people controller functions
const patientController = require('../controllers/patientController')


patientRouter.get('/', patientController.getAllPatients)
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
patientRouter.get('/:patient_id', patientController.getPatientById)

patientRouter.get('/:patient_id/insertGlucose', patientController.getGlucosePage)
patientRouter.post('/:patient_id/insertGlucose', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertInsulin', patientController.getInsulinPage)
patientRouter.post('/:patient_id/insertInsulin', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertSteps', patientController.getStepsPage)
patientRouter.post('/:patient_id/insertSteps', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertWeight', patientController.getWeightPage)
patientRouter.post('/:patient_id/insertWeight', patientController.insertPatientData)

<<<<<<< HEAD
=======

>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
// export the router
module.exports = patientRouter
