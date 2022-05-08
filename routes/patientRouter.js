const express = require('express')
const passport = require('../passport')

// create our Router object
const patientRouter = express.Router()

// import patient controller functions
const patientController = require('../controllers/patientController')


// patient routes used
patientRouter.get('/login', patientController.getPatientLoginPage)
patientRouter.post('/login', passport.authenticate('local', { failureRedirect: '/patient/login', failureFlash: true }), patientController.patientLogin)
patientRouter.post('/logout', patientController.patientLogout)

patientRouter.get('/dashboard', patientController.getPatientById)

patientRouter.get('/dashboard/insertGlucose', patientController.getGlucosePage)
patientRouter.post('/dashboard/insertGlucose', patientController.insertPatientData)

patientRouter.get('/dashboard/insertInsulin', patientController.getInsulinPage)
patientRouter.post('/dashboard/insertInsulin', patientController.insertPatientData)

patientRouter.get('/dashboard/insertSteps', patientController.getStepsPage)
patientRouter.post('/dashboard/insertSteps', patientController.insertPatientData)

patientRouter.get('/dashboard/insertWeight', patientController.getWeightPage)
patientRouter.post('/dashboard/insertWeight', patientController.insertPatientData)

// export the router
module.exports = patientRouter
