// Patient's schema model imported
const {Patient, Data, DataSet} = require('../models/patient')

// Imported libraries used
const SALT_FACTOR = 10 // bcrypt salt constant
const bcrypt = require('bcryptjs') // use bcrypt
const he = require('he') // use he 
const {validationResult} = require('express-validator'); // use express-validator

// UTC -> Melbourne Timezone formatter 
const melbDate = new Intl.DateTimeFormat('en-au', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hourCycle: 'h23',
    timeZone: 'Australia/Melbourne'
  });

// Today's date in Melbourne timezone
const todaysDate = melbDate.formatToParts(new Date()); // today's date constant 

// Middleware to compare full dates (date, month, year)
// Returns boolean to see if date of inputted data is same as today's date
const compareDates = (patientDate)=> {

    patientDate = melbDate.formatToParts(patientDate); // convert from UTC -> Melb

    const sameDate = patientDate[2].value == todaysDate[2].value // check for same day
    const sameMonth = patientDate[4].value == todaysDate[4].value // check for same month
    const sameYear = patientDate[6].value == todaysDate[6].value // check for same year

    return ( (sameDate) && (sameMonth) && (sameYear) )
}

// Middleware to calculate a patient's engagement score 
// Returns the latest patient's engagement score
const calculateES = (inputData, sameDay) => {
    
    const total = inputData.length // total of days since patient first logged in
    var accum = 0 // counter of days where patient inputted at least one data
    
    // calculate engagement score
    for (var i in inputData) {
        var gluc = inputData[i].glucose_data
        var wei = inputData[i].weight_data
        var ins = inputData[i].insulin_data
        var step = inputData[i].steps_data
                
        // minimum of one data that's inputted to increase engagement score 
        if ( (gluc) || (wei) || (ins) || (step) ) {
            accum +=1;
        }
    }
            
    if (sameDay) { 
        return (Math.round((accum/total)*100)) // session is still within today
    } else {
        return (Math.round((accum/(total+1))*100)) // new day
    }  
}

// Function which renders patient's login page 
const getPatientLoginPage = (req,res)=> {
    res.render('patientLogin', {flash: req.flash('error'), title: 'Login'})
}

// Logs out patient from their current session
const patientLogout = (req,res)=>{
    req.logout()
    res.redirect('/') // return to login page
}

// Function which renders patient's profile page
const getPatientProfile = (req, res) => {
    return res.render('patientProfile', {patient: req.user.toJSON(), date: todaysDate, flash: req.flash('errors')})
}

// Function to retrieve patient's password page change
const getPassPage = (req,res) => {
    return res.render('changePass', {flash: req.flash('errors')})
}

// Function to retrieve a patient's dashboard during their current session
const getPatientDashboard = async (req, res) => {

    try {
        // clinician message for the current patient 
        const message = req.user.clinician_message.note_content;

        const total = req.user.input_data.length // total of days since patient first logged in

        if (compareDates(req.user.input_data[total-1].set_date)) {
            
            // calculate today's engagement score of the current patient
            // here, true means it's still the same day
            var es = calculateES(req.user.input_data, true) 
            // Still same day, hence render today's dashboard
            Patient.updateOne(
                { _id: req.user._id},
                {score: es}, // updates engagement score
                function(err, doc) {
                    if (err) {
                        res.redirect('/patient/404')
                    } else{
                        
                        }
                    }
                )
            return res.render('patientDashboard', { patient: req.user.toJSON(), 
                    patientData: req.user.input_data[total-1].toJSON(), score: es, date: todaysDate, note: message})
        }
        
        var diff = (new Date()).getDate() - req.user.input_data[total-1].set_date.getDate();
        var last = req.user.input_data[total-1].set_date.getDate();

        for (var i = 1; i <=diff; i++){
            // it's a new day, create new input_data schema for a patient
            const patientData = new DataSet({set_date: (new Date()).setDate(last+i)})
        
            // pushes this input_data into the patient in mongoDB
            Patient.updateOne({ _id: req.user._id},
                {$push: {input_data: patientData}}, // pushes new dataset and updates engagement score
                {safe: true, upsert: true, new: true},
                function(err, doc) {
                    if(err) {
                        return res.redirect('/patient/404')
                    }else {
                    
                }   
                }
            )
        }

        // calculate today's engagement score of the current patient
        // here, false means patient has just first logged in for today
        es = calculateES(req.user.input_data, false)


        return res.render('patientDashboard', {patient: req.user.toJSON(), 
            patientData: patientData, score: es, date: todaysDate, note: message})

    } catch (err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve glucose submission page of a patient
const getGlucosePage = async (req,res) =>{
    try {
        const patient = await Patient.findById(req.user._id).lean()
        const total = patient.input_data.length
  
        if ( (patient.input_data[total-1].glucose_data == null) && (patient.threshold_list[0].th_required) ){
            // today's glucose data hasn't been entered, and glucose is required by clinician
            return res.render('insertGlucose', { patient: patient, flash: req.flash('errors')})
        }
        // otherwise, prevent double entry and redirects back to dashboard
        return res.redirect('/patient/dashboard')

    } catch (err) {
         // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve steps submission page of a patient
const getStepsPage= async(req,res) =>{

    try {
        const patient = await Patient.findById(req.user._id).lean()
        const total = patient.input_data.length

        if ( (patient.input_data[total-1].steps_data == null) && (patient.threshold_list[1].th_required) ){
            // today's steps data hasn't been entered, and steps is required by clinician
            return res.render('insertSteps', { patient: patient, flash: req.flash('errors')})
        }
        // otherwise, prevent double entry and redirects back to dashboard
        return res.redirect('/patient/dashboard')

    } catch (err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve weight submission page of a patient
const getWeightPage= async(req,res) =>{
    try {
        const patient = await Patient.findById(req.user._id).lean()
        const total = patient.input_data.length

        if ( (patient.input_data[total-1].weight_data == null) && (patient.threshold_list[2].th_required)) {
            // today's weight data hasn't been entered, and weight  is required by clinician
            return res.render('insertWeight', { patient: patient, flash: req.flash('errors')})
        }
        // otherwise, prevent double entry and redirects back to dashboard
        return res.redirect('/patient/dashboard')

    } catch (err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve insulin submission page of a patient
const getInsulinPage= async(req,res) =>{

    try {
        const patient = await Patient.findById(req.user._id).lean()
        const total = patient.input_data.length

        if ( (patient.input_data[total-1].insulin_data == null) && (patient.threshold_list[3].th_required)) {
            // today's weight data hasn't been entered, and weight  is required by clinician
            return res.render('insertInsulin', { patient: patient, flash: req.flash('errors')})
        }
        // otherwise, prevent double entry and redirects back to dashboard
        return res.redirect('/patient/dashboard')

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
    
}

// Function to push the patient's inputted data into it's document on mongoDB
const insertPatientData= async(req, res) => {

    try {
        const patient = await Patient.findById(req.user._id).lean()
        
        // create new Data object
        var newData = new Data(req.body)
        // newData.data_comment = he.unescape(req.body.data_comment)
        newData.data_date = new Date()

        // detect input errors 
        const errors = validationResult(req)
        if (!errors.isEmpty()) {

            const errorsFound = validationResult(req).array()
            req.flash('errors', errorsFound);

            if (newData.data_type== 'glucose') {
                // invalid glucose data/comment
                return res.redirect('/patient/insertGlucose')
            }
            if (newData.data_type== 'insulin') {
                // invalid insulin data/comment
                return res.redirect('/patient/insertInsulin')
            }
            if (newData.data_type== 'steps') {
                // invalid steps data/comment
                return res.redirect('/patient/insertSteps')
            }
            if (newData.data_type== 'weight') {
                // invalid weight data/comment
                return res.redirect('/patient/insertWeight')
            }
        }
    
        const total = patient.input_data.length

        // glucose data type inputted
        if (req.body.data_type == "glucose") {
            // sets glucose entry for the day
            Patient.updateOne( 
                { _id: req.user._id, "input_data._id": patient.input_data[total-1]._id},
                {$set: {"input_data.$.glucose_data": newData}},
                function(err, doc) {
                    if (err) {
                        return res.redirect('/patient/404')
                    } else{
                        
                    }
                }
            )
            // redirect patient to the dashboard page
            return res.redirect('/patient/dashboard')
        }

        // steps data type inputted
        if (req.body.data_type == "steps") {
            // sets steps entry for the day
            Patient.updateOne(
                { _id: req.user._id, "input_data._id": patient.input_data[total-1]._id},
                { $set: {"input_data.$.steps_data": newData}},
                function(err, doc) {
                    if (err) {
                        return res.redirect('/patient/404')
                    } else {
                        
                    }
                }
            )
            // redirect patient to the dashboard page
            return res.redirect('/patient/dashboard')
        }

        // weight data type inputted
        if (req.body.data_type == "weight") {
            // sets weight entry for the day
            Patient.updateOne(
                { _id: req.user._id, "input_data._id": patient.input_data[total-1]._id},
                { $set: {"input_data.$.weight_data": newData}},
                function(err, doc) {
                    if (err) {
                        return res.redirect('/patient/404')
                    } else{
                        
                    }
                }
            )
            // redirect patient to the dashboard page
            return res.redirect('/patient/dashboard')
        }

        // insulin data type inputted
        if (req.body.data_type == "insulin") {
            // sets insulin entry for the day
            Patient.updateOne(
                {_id: req.user._id,"input_data._id": patient.input_data[total-1]._id},
                {$set: {"input_data.$.insulin_data": newData}},
                function(err, doc) {
                    if (err) {
                        return res.redirect('/patient/404')
                    } else {
                        
                    }
                }
            ) 
            // redirect patient to the dashboard page
            return res.redirect('/patient/dashboard')
        }

    } catch (err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve patient's log page
// Contains history of data inputted by patients
const getPatientLog = (req,res)=>{

    try {
        const sortedInputs = []
        const inputs = req.user.input_data
        
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){
            sortedInputs.push(inputs[i].toJSON())
        }

        return res.render('patientLog', {patient: req.user.toJSON(), input: sortedInputs, date: todaysDate})

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to update patient's password
const updatePass = async (req,res) =>{

    try {
        
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const errorsFound = validationResult(req).array()
            req.flash('errors', errorsFound);
            return res.redirect('/patient/change-password')
        }

        // hash the password using bcrypt before saving to mongodb
        const hashed_pass = await bcrypt.hash(req.body.password, SALT_FACTOR)
        Patient.findOneAndUpdate(
            { _id: req.user._id},
            {password: hashed_pass},
            function(err, doc) {
                if (err) {
                    return res.redirect('/patient/404')
                } else {
                      
                }
            }
        )
    
        return res.redirect('/patient/dashboard')
        

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to update patient's short bio
const updateProfile = (req,res) =>{

    try {
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsFound = validationResult(req).array()
            req.flash('errors', errorsFound);
            return res.redirect('/patient/profile')
        }
        
        Patient.findOneAndUpdate(
            { _id: req.user._id},
            {short_bio: req.body.short_bio},
            function(err, doc) {
                if (err) {
                    return res.redirect('/patient/404')
                } else {
                      
                }
            }
        )
    
        return res.redirect('/patient/profile')
        

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve patient's leaderboard
// Returns the top five ranking patients based on their engagement score
const getLeaderboard = async (req,res) => {
    
    try {
        const userScores = []
        const users = await Patient.find()
        
        // sort function based on patient's engagement score
        users.sort( function(patient1, patient2) {
            return patient2.score - patient1.score // sorts in descending order
        })

        // pushes top 5 patients into leaderboard
        for (i in users){
            var temp = []
            temp.push(parseInt(i)+1); temp.push(users[i].screen_name); temp.push(users[i].score)
            userScores.push(temp)
            
            if (parseInt(i)==4){
                // only 5 patients in leaderboard allowed
                break;
            }
        }

        return res.render ('leaderboard', {patient: req.user.toJSON(), board: userScores, date: todaysDate})

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/patient/404')
    }
}

// Function to retrieve patient's error page
const getErrorPage = (req,res)=>{
    return res.render('404')
}

// exports objects containing functions imported by patient router
module.exports = {
    getPatientLoginPage,
    patientLogout,
    insertPatientData,
    getPatientDashboard,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage,
    getPatientLog,
    getPatientProfile,
    updateProfile,
    getPassPage,
    updatePass,
    getLeaderboard,
    getErrorPage
}