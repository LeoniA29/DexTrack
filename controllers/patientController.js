// schema models imported
const {Patient, Data, DataSet, Threshold} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId // ObjectID constant 
const todaysDate = new Date(); // today's date constant 

// add Express-Validator
const {validationResult, check } = require('express-validator')

// middleware to compare full dates (date, month, year)
const compareDates = (patientDate)=> {
    const sameDate = patientDate.getDate() == todaysDate.getDate()
    const sameMonth = patientDate.getMonth() == todaysDate.getMonth()
    const sameYear = patientDate.getFullYear() == todaysDate.getFullYear()
    return ( (sameDate) && (sameMonth) && (sameYear) )
}

// function which renders patient's login page 
const getPatientLoginPage = (req,res)=> {
    res.render('patientLogin', {flash: req.flash('error'), title: 'Login'})
}

// function which redirects patient to their dashboard once login is successful
const patientLogin =(req, res)=>{
    res.redirect('/patient/dashboard')
}

// logouts patient from their current session
const patientLogout = (req,res)=>{
    req.logout()
    res.redirect('/patient/login')
}

// function to retrieve a patient's dashboard during their current session
const getPatientById = async (req, res) => {
   
        for (i in req.user.input_data){
            // iterating through each patient's time-series inputs

            if ( compareDates(req.user.input_data[i].set_date) ) {
                // render today's patient data if found one 
                return res.render('patientDashboard', { patient: req.user.toJSON(), patientData: req.user.input_data[i].toJSON()} )
            }
        }

        // it's a new day, create new input_data schema for a patient
        const patientData = new DataSet({set_date: todaysDate})
    
        // pushes this input_data into the patient in mongoDB
        Patient.findByIdAndUpdate(req.user._id,
            {$push: {input_data: patientData}},
            {safe: true, upsert: true, new: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                }
            }
        )

        return res.render('patientDashboard', {patient: req.user.toJSON(), patientData: patientData})
}

// function to retrieve glucose submission page of a patient
const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.user._id).lean()

    for (i in patient.input_data){
        if (compareDates(patient.input_data[i].set_date)) {
            if ( (patient.input_data[i].glucose_data == null) && (patient.threshold_list[0].th_required) ){
                return res.render('insertGlucose', { patient: patient, flash: req.flash('errors')})
            }
        }
    }
    return res.redirect('/patient/dashboard')
}

// function to retrieve insulin submission page of a patient
const getInsulinPage= async(req,res) =>{
    const patient = await Patient.findById(req.user._id).lean()
    for (i in patient.input_data){
        if (compareDates(patient.input_data[i].set_date)) {
            if ( (patient.input_data[i].insulin_data == null) && (patient.threshold_list[3].th_required)) {
                return res.render('insertInsulin', { patient: patient, flash: req.flash('errors')})
            }
        }
    }
    return res.redirect('/patient/dashboard')
}

// function to retrieve steps submission page of a patient
const getStepsPage= async(req,res) =>{
    const patient = await Patient.findById(req.user._id).lean()
    for (i in patient.input_data){
        if (compareDates(patient.input_data[i].set_date)) {
            if ( (patient.input_data[i].steps_data == null) && (patient.threshold_list[1].th_required) ){
                return res.render('insertSteps', { patient: patient, flash: req.flash('errors')})
            }
        }
    }
    return res.redirect('/patient/dashboard')
}

// function to retrieve weight submission page of a patient
const getWeightPage= async(req,res) =>{
    const patient = await Patient.findById(req.user._id).lean()
    for (i in patient.input_data){
        if (compareDates(patient.input_data[i].set_date)) {
            if ( (patient.input_data[i].weight_data == null) && (patient.threshold_list[2].th_required)) {
                return res.render('insertWeight', { patient: patient, flash: req.flash('errors')})
            }
        }
    }
    return res.redirect('/patient/dashboard')
}


// function to push the inputted data of a patient into it's record on mongoDB
// all submission pages uses this function to do the task
const insertPatientData= async(req, res) => {


    try {
        const patient = await Patient.findById(req.user._id).lean()
        
        var newData = new Data(req.body)
        newData.data_date = Date.now()

        const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorsFound = validationResult(req).array()
                req.flash('errors', errorsFound);

                    if (newData.data_type== 'glucose'){
                        return res.redirect('/patient/insertGlucose')
                    }
                    if (newData.data_type== 'insulin'){
                        return res.redirect('/patient/insertInsulin')
                    }
                    if (newData.data_type== 'steps'){
                        return res.redirect('/patient/insertSteps')
                    }
                    if (newData.data_type== 'weight'){
                        return res.redirect('/patient/insertWeight')
                    }
            }

    for (i in patient.input_data){
        if (patient.input_data[i].set_date.getDate() == todaysDate.getDate() ) {

            // convert input ID into an instance of an object
            const inputID = patient.input_data[i]._id
            var objectInput = new ObjectId(inputID)
            
        
            // glucose data type inputted
            if (req.body.data_type == "glucose") {
                
                // sets glucose entry for the day
                Patient.updateOne( 
                { _id: req.user._id, "input_data._id": objectInput},
                {$set: {"input_data.$.glucose_data": newData}},
                function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else{
                        }
                    }
                )
            }

            // steps data type inputted
            if (req.body.data_type == "steps") {
               
                // sets steps entry for the day
                Patient.updateOne(
                { _id: req.user._id, "input_data._id": objectInput},
                { $set: {"input_data.$.steps_data": newData}},
                function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        }
                    }
                )
            }

            // weight data type inputted
            if (req.body.data_type == "weight") {
              
                // sets weight entry for the day
                Patient.updateOne(
                { _id: req.user._id, "input_data._id": objectInput},
                { $set: {"input_data.$.weight_data": newData}},
                function(err, doc) {
                     if (err) {
                        console.log(err);
                    } else{
                        }
                    }
                )
            }

            // insulin data type inputted
            if (req.body.data_type == "insulin") {
                
                // sets insulin entry for the day
                Patient.updateOne(
                {_id: req.user._id,"input_data._id": objectInput},
                {$set: {"input_data.$.insulin_data": newData}},
                function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        }
                    }
                ) 
            }

        }
    }

    // redirect patient to the dashboard page
    return res.redirect('/patient/dashboard')
    } catch (err) {
        return res.redirect('/patient/404')
    }
}

const getPatientLog = (req,res)=>{

    const sortedInputs = []
    const inputs = req.user.input_data
   
    for (var i = inputs.length - 1; i>=0; i--){
        sortedInputs.push(inputs[i])
    }
    return res.render('patientLog', {input: sortedInputs, patient: req.user.toJSON()})
}

const getPatientProfile = (req, res) => {

    return res.render('patientProfile', {patient: req.user.toJSON(), flash: req.flash('errors')})
}

const updateProfile = (req,res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsFound = validationResult(req).array()
        // console.log(errorsFound)
        req.flash('errors', errorsFound);
        return res.redirect('/patient/profile')
        // return res.send(errors) // if validation errors, do not process data
    }
        else {
            Patient.findOneAndUpdate(
                { _id: req.user._id},
                {screen_name: req.body.screen_name},
                function(err, doc) {
                     if (err) {
                        console.log(err);
                    } else{
                        }
                    }
                )
            return res.redirect('/patient/profile')
        }
       
}

const getErrorPage = (req,res)=>{
    return res.render('404')
}


// exports objects containing functions imported by router
module.exports = {
    getPatientLoginPage,
    patientLogin,
    patientLogout,
    insertPatientData,
    getPatientById,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage,
    getPatientLog,
    getPatientProfile,
    updateProfile,
    getErrorPage
}


   
