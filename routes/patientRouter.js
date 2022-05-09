const express = require('express')
const passport = require('../passport')

// create our Router object
const patientRouter = express.Router()

// import patient controller functions
const patientController = require('../controllers/patientController')

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/patient/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// patient routes used
patientRouter.get('/login', patientController.getPatientLoginPage)
patientRouter.post('/login', passport.authenticate('local', { failureRedirect: '/patient/login', failureFlash: true }), patientController.patientLogin)
patientRouter.post('/logout', patientController.patientLogout)

patientRouter.get('/dashboard', isAuthenticated, patientController.getPatientById)

patientRouter.get('/insertGlucose', isAuthenticated, patientController.getGlucosePage)
patientRouter.post('/insertGlucose', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertInsulin', isAuthenticated, patientController.getInsulinPage)
patientRouter.post('/insertInsulin', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertSteps', isAuthenticated, patientController.getStepsPage)
patientRouter.post('/insertSteps', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertWeight', isAuthenticated, patientController.getWeightPage)
patientRouter.post('/insertWeight', isAuthenticated, patientController.insertPatientData)

// export the router
module.exports = patientRouter
