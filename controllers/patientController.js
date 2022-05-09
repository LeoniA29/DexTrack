// schema models imported
const {Patient, Data, DataSet, Threshold} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId // ObjectID constant 
const todaysDate = new Date(); // today's date constant 


// middleware to compare full dates (date, month, year)
const compareDates = (patientDate)=> {
    const sameDate = patientDate.getDate() == todaysDate.getDate()
    const sameMonth = patientDate.getMonth() == todaysDate.getMonth()
    const sameYear = patientDate.getFullYear() == todaysDate.getFullYear()
    return ( (sameDate) && (sameMonth) && (sameYear) )
}

// function which renders patient's login page 
const getPatientLoginPage = (req,res)=> {
    res.render('login', {flash: req.flash('error'), title: 'Login'})
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
const getPatientById = (req, res) => {
   
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
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                }
            }
        )

        // new input_data entry is pushed at the back of the array 
        // not n-1, because const 'patient' not updated yet, only pushed to database
        const n = patient.input_data.length 
        return res.render('patientDashboard', { patient: req.user.toJSON(), patientData: req.user.input_data[n].toJSON()})
}

// function to retrieve glucose submission page of a patient
const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.user._id).lean()

    for (i in patient.input_data){
        if (compareDates(patient.input_data[i].set_date)) {
            if ( (patient.input_data[i].glucose_data == null) && (patient.threshold_list[0].th_required) ){
                return res.render('insertGlucose', { patient: patient })
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
                return res.render('insertInsulin', { patient: patient })
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
                return res.render('insertSteps', { patient: patient })
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
                return res.render('insertWeight', { patient: patient })
            }
        }
    }
    return res.redirect('/patient/dashboard')
}


// function to push the inputted data of a patient into it's record on mongoDB
// all submission pages uses this function to do the task
const insertPatientData= async(req, res, next) => {

    // convert patientID into an instance of an object

    try {
        const patient = await Patient.findById(req.user._id).lean()
    
        var newData = new Data(req.body)

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
        return next(err)
    }
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
    getWeightPage
}


   
