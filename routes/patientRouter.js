// libraries imported
const express = require('express') // for express-validator
const passport = require('../passport') // for passport and session
const {body} = require('express-validator') // for express-validator

// create Router object
const patientRouter = express.Router()

// import patient controller functions
const patientController = require('../controllers/patientController')

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // patient not authenticated, redirect to patient login page
    if (!req.isAuthenticated()) {
        return res.redirect('/patient/login')
    }
    // if successful, proceed to dashboard in controller
    return next()
}

// Patient role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        // user is a patient
        if (req.user.role == thisRole) 
            return next()
        else {
        // not a patient
            res.redirect('/patient/login')
        }
    }    
}

// Routes used by Patient
patientRouter.get('/login', patientController.getPatientLoginPage)
patientRouter.post('/login', passport.authenticate('local', 
    {successRedirect: '/patient/dashboard', failureRedirect: '/patient/login', failureFlash: true}))

patientRouter.post('/logout', isAuthenticated, hasRole('patient'), patientController.patientLogout)

patientRouter.get('/dashboard', isAuthenticated, hasRole('patient'), patientController.getPatientDashboard)
patientRouter.post('/dashboard', patientController.patientLogout)

patientRouter.get('/insertGlucose', isAuthenticated, hasRole('patient'), patientController.getGlucosePage)
patientRouter.post('/insertGlucose', isAuthenticated, 

    body('data_entry', 'invalid glucose data entered').isFloat({min: 0, max: 10000}).escape(), // glucose data must numeric, not negative and not too large
    body('data_comment', 'comment cannot exceed 250 characters').isLength({max: 250}).blacklist('$<>&{}'), // comment can't exceed 250 characters

    patientController.insertPatientData)

patientRouter.get('/insertInsulin', isAuthenticated, hasRole('patient'), patientController.getInsulinPage)
patientRouter.post('/insertInsulin', isAuthenticated, 

    body('data_entry', 'invalid insulin glucose data entered').isFloat({min: 0, max: 10000}).escape(), // insulin data must numeric, not negative and not too large
    body('data_comment', 'comment cannot exceed 250 characters').isLength({max: 250}).blacklist('$<>&{}'), // comment can't exceed 250 characters


    patientController.insertPatientData)

patientRouter.get('/insertSteps', isAuthenticated, hasRole('patient'), patientController.getStepsPage)
patientRouter.post('/insertSteps', isAuthenticated, 

    body('data_entry', 'invalid steps data entered').isFloat({min: 0, max: 50000}).escape(), // steps data must be numeric, not negative and not too large
    body('data_comment', 'comment cannot exceed 250 characters').isLength({max: 250}).blacklist('$<>&{}'),// comment can't exceed 250 characters


    patientController.insertPatientData)

patientRouter.get('/insertWeight', isAuthenticated, hasRole('patient'), patientController.getWeightPage)
patientRouter.post('/insertWeight', isAuthenticated, 

    body('data_entry', 'Weight data cannot be negative').isFloat({min: 0, max: 1000}).escape(), // Weight data must numeric and not negative
    body('data_comment', 'Comment cannot exceed 250 characters').isLength({max: 250}).blacklist('$<>&{}'), // comment can't exceed 250 characters   

    patientController.insertPatientData)

patientRouter.get('/log', isAuthenticated, hasRole('patient'), patientController.getPatientLog)

patientRouter.get('/leaderboard', isAuthenticated, hasRole('patient'), patientController.getLeaderboard)

patientRouter.get('/profile', isAuthenticated, hasRole('patient'), patientController.getPatientProfile)
patientRouter.post('/profile', isAuthenticated, 

    body('short_bio', 'Short bio is too long, please shorten it!').isLength({max: 250}).escape(), // short bio must not exceed 250 characters

    patientController.updateProfile)

patientRouter.get('/change-password', isAuthenticated, hasRole('patient'), patientController.getPassPage)
patientRouter.post('/change-password', isAuthenticated, 

    body('password', 'Password is not strong enough').isStrongPassword().escape(), // password must be strong   
    
    patientController.updatePass)

patientRouter.get('/404', isAuthenticated, hasRole('patient'), patientController.getErrorPage)

// export the router
module.exports = patientRouter
