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

clinicianRouter.post('/logout', clinicianController.clinicianLogout)

clinicianRouter.get('/insert', clinicianController.getAllClinicians)
clinicianRouter.post('/insert', clinicianController.insertClinician)

clinicianRouter.get('/dashboard', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientList)

clinicianRouter.get('/registerPatient', isAuthenticated, hasRole('clinician'), clinicianController.getRegisterPage)

clinicianRouter.post('/registerPatient', isAuthenticated,

    body('first_name', ' first name must be valid').isAlpha().escape(), 
    body('last_name', 'last name must be valid').isAlpha().escape(), 
    body('email', 'email must be valid').isEmail().escape(), 
    body('dob', 'date of birth must be valid').isDate().escape(), 
    body('occupation', 'occupation must be valid').isAlpha().escape(), 
    body('address', 'address must be valid').blacklist('$<>&{}'), 
    body('postcode', 'postcode must be valid and at-least 4 digits').isNumeric().isLength({min:4}).escape(), 
    body('phone', 'phone number must be valid').isMobilePhone().escape(), 
    
    clinicianController.insertPatient)

clinicianRouter.get('/patientComments', isAuthenticated, hasRole('clinician'), clinicianController.getPatientComments)
clinicianRouter.get('/clinicianViewPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatient)
clinicianRouter.post('/clinicianViewPatient', isAuthenticated, hasRole('clinician'), clinicianController.postClinicianPatient)

clinicianRouter.get('/clinicianNotesPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientNotes)
clinicianRouter.get('/clinicianNotesPatientInput', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientNotesInput)
clinicianRouter.post('/clinicianNotesPatientInput', isAuthenticated, hasRole('clinician'), 

    body('note', 'Note cannot exceed 10000 characters').isLength({max: 10000}).blacklist('$<>&{}'), // notes can't exceed 10000 characters

    clinicianController.postClinicianPatientNotesInput)

clinicianRouter.get('/clinicianSupportPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientSupport)
clinicianRouter.post('/clinicianSupportPatient', isAuthenticated, hasRole('clinician'), 

    body('message', 'Message cannot exceed 250 characters').isLength({max: 250}).blacklist('$<>&{}'), // notes can't exceed 10000 characters

    clinicianController.postClinicianPatientSupport)



clinicianRouter.get('/clinicianThresholdPatient', isAuthenticated, hasRole('clinician'), clinicianController.getClinicianPatientThresholdInput)
clinicianRouter.post('/clinicianThresholdPatient', isAuthenticated, hasRole('clinician'), 
    
    body('glucose_high', 'invalid glucose threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), // threshold data must be numeric, 
    body('glucose_low', 'invalid glucose threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), //not negative and not too large, can be null too as default
    body('weight_high', 'invalid weight threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), 
    body('weight_low', 'invalid weight threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), 
    body('insulin_high', 'invalid insulin threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), 
    body('insulin_low', 'invalid insulin threshold entered').isFloat({min: 0, max: 1000}).escape().optional({ nullable: true, checkFalsy: true }), 
    body('steps_high', 'invalid exercise threshold entered').isFloat({min: 0, max: 100000}).escape().optional({ nullable: true, checkFalsy: true }), 
    body('steps_low', 'invalid exercise threshold entered').isFloat({min: 0, max: 100000}).escape().optional({ nullable: true, checkFalsy: true }), 

    clinicianController.postClinicianPatientThresholdInput)

clinicianRouter.get('/404', isAuthenticated, hasRole('clinician'), clinicianController.getErrorPage)

clinicianRouter.get('/change-password', isAuthenticated, hasRole('clinician'), clinicianController.getChangePass)
clinicianRouter.post('/change-password', isAuthenticated, hasRole('clinician'),
    body('password', 'Password is not strong enough').isStrongPassword().escape(), // password must be strong 
clinicianController.updatePass)

// export the router
module.exports = clinicianRouter
