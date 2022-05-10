const express = require('express')
const passport = require('../passport')

// create our Router object
const clinicianRouter = express.Router()

// import clinician controller functions
const clinicianController = require('../controllers/clinicianController')

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/clinician/login')
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
            res.redirect('/clinician/login')
        }
    }    
}

// clinician routes used
clinicianRouter.get('/login', clinicianController.getClinicianLoginPage)
clinicianRouter.post('/login', passport.authenticate('local', { failureRedirect: '/clinician/login', failureFlash: true }), clinicianController.clinicianLogin)
clinicianRouter.post('/logout', clinicianController.clinicianLogout)

clinicianRouter.get('/dashboard', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientList)

clinicianRouter.get('/registerPatient', isAuthenticated, hasRole('clinician'), clinicianController.getRegisterPage)
clinicianRouter.post('/registerPatient', isAuthenticated, clinicianController.insertPatient)

clinicianRouter.get('/patientComments', isAuthenticated, hasRole('clinician'), clinicianController.getPatientComments)

//clinicianRouter.get('/patientProfile', isAuthenticated, hasRole('clinician'), clinicianController.getOnePatient)

//clinicianRouter.get('/', clinicianController.getAllClinicians)
//clinicianRouter.post('/', clinicianController.insertClinician)


// export the router
module.exports = clinicianRouter
