const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')


patientRouter.get('/', patientController.getAllPatients) // remove later
patientRouter.get('/:patient_id', patientController.getPatientById)

patientRouter.get('/:patient_id/insertGlucose', patientController.getGlucosePage)
patientRouter.post('/:patient_id/insertGlucose', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertInsulin', patientController.getInsulinPage)
patientRouter.post('/:patient_id/insertInsulin', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertSteps', patientController.getStepsPage)
patientRouter.post('/:patient_id/insertSteps', patientController.insertPatientData)

patientRouter.get('/:patient_id/insertWeight', patientController.getWeightPage)
patientRouter.post('/:patient_id/insertWeight', patientController.insertPatientData)

// export the router
module.exports = patientRouter
