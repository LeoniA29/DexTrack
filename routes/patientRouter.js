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

// set up role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole) 
            return next()
        else {
            res.redirect('/patient/login')
        }
    }    
}

// patient routes used
patientRouter.get('/login', patientController.getPatientLoginPage)
patientRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/patient/dashboard', failureRedirect: '/login', failureFlash: true
    }))
patientRouter.post('/dashboard', patientController.patientLogout)

patientRouter.get('/dashboard', isAuthenticated, hasRole('patient'), patientController.getPatientById)

patientRouter.get('/insertGlucose', isAuthenticated, hasRole('patient'), patientController.getGlucosePage)
patientRouter.post('/insertGlucose', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertInsulin', isAuthenticated, hasRole('patient'), patientController.getInsulinPage)
patientRouter.post('/insertInsulin', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertSteps', isAuthenticated, hasRole('patient'), patientController.getStepsPage)
patientRouter.post('/insertSteps', isAuthenticated, patientController.insertPatientData)

patientRouter.get('/insertWeight', isAuthenticated, hasRole('patient'), patientController.getWeightPage)
patientRouter.post('/insertWeight', isAuthenticated, patientController.insertPatientData)

// export the router
module.exports = patientRouter
