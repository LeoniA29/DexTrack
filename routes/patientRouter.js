const express = require('express')
const passport = require('../passport')
const app = express()

// create our Router object
const patientRouter = express.Router()

// add Express-Validator
const {body} = require('express-validator')

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
    successRedirect: '/patient/dashboard', failureRedirect: '/patient/login', failureFlash: true
    }))
// patientRouter.post('/logout', patientController.patientLogout)
patientRouter.post('/dashboard', patientController.patientLogout)


patientRouter.get('/dashboard', isAuthenticated, hasRole('patient'), patientController.getPatientById)

patientRouter.get('/insertGlucose', isAuthenticated, hasRole('patient'), patientController.getGlucosePage)
patientRouter.post('/insertGlucose', isAuthenticated, 

    body('data_entry', 'glucose entry must be valid').not().isEmpty().isNumeric().escape(), 
    body('data_comment', 'comment must be valid').isLength({max:260}).escape(),

    patientController.insertPatientData)

patientRouter.get('/insertInsulin', isAuthenticated, hasRole('patient'), patientController.getInsulinPage)
patientRouter.post('/insertInsulin', isAuthenticated, 

    body('data_entry', 'insulin entry must be valid').not().isEmpty().isNumeric().escape(), 
    body('data_comment', 'comment must be valid').isLength({max:260}).escape(),   

    patientController.insertPatientData)

patientRouter.get('/insertSteps', isAuthenticated, hasRole('patient'), patientController.getStepsPage)
patientRouter.post('/insertSteps', isAuthenticated, 

    body('data_entry', 'insulin entry must be valid').not().isEmpty().isNumeric().escape(), 
    body('data_comment', 'comment must be valid').isLength({max:260}).escape(),   

    patientController.insertPatientData)

patientRouter.get('/insertWeight', isAuthenticated, hasRole('patient'), patientController.getWeightPage)
patientRouter.post('/insertWeight', isAuthenticated, 

    body('data_entry', 'weight entry must be valid').not().isEmpty().isNumeric().escape(), 
    body('data_comment', 'comment must be valid').isLength({max:260}).escape(),  

    patientController.insertPatientData)

patientRouter.get('/log', isAuthenticated, hasRole('patient'), patientController.getPatientLog)

patientRouter.get('/profile', isAuthenticated, hasRole('patient'), patientController.getPatientProfile)
patientRouter.post('/profile', isAuthenticated, 

    body('screen_name', 'screen name must only be alphanumeric').not().isEmpty().isAlphanumeric().escape(),      

    patientController.updateProfile)


patientRouter.get('/404', isAuthenticated, hasRole('patient'), patientController.getErrorPage)
// export the router
module.exports = patientRouter
