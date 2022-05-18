const express = require('express')
const passport = require('../passport')

// create our Router object
const clinicianRouter = express.Router()

// add Express-Validator
const {body} = require('express-validator')

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

// patient routes used
clinicianRouter.get('/login', clinicianController.getClinicianLoginPage)
clinicianRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/clinician/dashboard', failureRedirect: '/clinician/login', failureFlash: true
    }))

clinicianRouter.post('/dashboard', clinicianController.clinicianLogout)

clinicianRouter.get('/insert', clinicianController.getAllClinicians)
clinicianRouter.post('/insert', clinicianController.insertClinician)

clinicianRouter.get('/dashboard', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientList)

clinicianRouter.get('/registerPatient', isAuthenticated, hasRole('clinician'), clinicianController.getRegisterPage)

clinicianRouter.post('/registerPatient', isAuthenticated,

    body('first_name', ' first name must be valid').not().isEmpty().isAlpha().escape(), 
    body('last_name', 'last name must be valid').not().isEmpty().isAlpha().escape(), 
    body('email', 'email must be valid').not().isEmpty().isEmail().escape(), 
    body('dob', 'date of birth must be valid').not().isEmpty().isDate().escape(),
    body('occupation', 'occupation must be valid').not().isEmpty().isString().escape(), 
    body('address', 'address must be valid').not().isEmpty().isString().escape(),
    body('postcode', 'postcode must be valid and at-least 4 digits').not().isEmpty().isNumeric().isLength({min:4}).escape(),  
    body('phone', 'phone number must be valid').not().isEmpty().isNumeric().escape(),
    
    clinicianController.insertPatient)

clinicianRouter.get('/patientComments', isAuthenticated, hasRole('clinician'), clinicianController.getPatientComments)
clinicianRouter.get('/clinicianViewPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatient)
clinicianRouter.post('/clinicianViewPatient', isAuthenticated, hasRole('clinician'), clinicianController.postClinicianPatient)

clinicianRouter.get('/clinicianNotesPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientNotes)
clinicianRouter.get('/clinicianNotesPatientInput', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientNotesInput)
clinicianRouter.post('/clinicianNotesPatientInput', isAuthenticated, hasRole('clinician'), clinicianController.postClinicianPatientNotesInput)

clinicianRouter.get('/clinicianSupportPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientSupport)
clinicianRouter.post('/clinicianSupportPatient', isAuthenticated, hasRole('clinician'), clinicianController.postClinicianPatientSupport)


// export the router
module.exports = clinicianRouter
