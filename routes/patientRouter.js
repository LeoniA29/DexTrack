const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all people data
patientRouter.get('/', patientController.getAllPatientData)

// add a route to hbs page to register new patient
patientRouter.get('/register', patientController.registerPatient)

// add a route to handle the GET request for one data instance
patientRouter.get('/:Patient_id', patientController.getDataById)

// add a new JSON object to the database
patientRouter.post('/register', patientController.insertData)

// export the router
module.exports = patientRouter
