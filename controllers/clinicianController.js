const Clinician = require('../models/clinician')
const {Patient, DataSet, Threshold, Note} = require('../models/patient')
const SALT_FACTOR = 10 // bcrypt salt constant
const bcrypt = require('bcryptjs') // use bcrypt

const formatter = new Intl.DateTimeFormat('en-au', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hourCycle: 'h24',
    timeZone: 'Australia/Melbourne'
  });

const todaysDate = formatter.formatToParts(new Date()); // today's date constant 

// middleware to compare full dates (date, month, year)
const compareDates = (clinicianDate)=> {

    clinicianDate = formatter.formatToParts(clinicianDate); 

    const sameDate = clinicianDate[2].value == todaysDate[2].value
    const sameMonth = clinicianDate[4].value == todaysDate[4].value
    const sameYear = clinicianDate[6].value == todaysDate[6].value
    
    return ( (sameDate) && (sameMonth) && (sameYear) )
}


// add Express-Validator
const {validationResult, check } = require('express-validator');
const { ObjectId } = require('bson');

// function which renders patient's login page 
const getClinicianLoginPage = (req,res)=> {
    res.render('clinicianLogin', {flash: req.flash('error'), title: 'Login'})
}

// function which redirects patient to their dashboard once login is successful
const clinicianLogin =(req, res)=>{
    res.redirect('/clinician/dashboard')
}

// logouts patient from their current session
const clinicianLogout = (req,res)=>{
    req.logout()
    res.redirect('/')
}

// this is for testing, once login feature enabled, it will not be necessary
const getAllClinicians = async (req, res, next) => {
 try {
 const clinicians = await Clinician.find().lean()
 return res.render('allClinicians', { data: clinicians })
 } catch (err) {
 return next(err)
 }
}

// this is for testing, once login feature enabled, it will not be necessary

const getClinicianById = async(req, res, next) => {
 try {
 const clinician = await Clinician.findById(req.params.clinician_id).lean()
 if (!clinician) {
 // no clinician found in database
 return res.sendStatus(404)
 }

 // found data and get clinician list
 return res.render('oneData', { oneItem: clinician})
 } catch (err) {
 return next(err)
 }
}

// this is for testing, once login feature enabled, it will not be necessary
const insertClinician= async (req, res) => {
    var newData = new Clinician(req.body)

    newData.password = "INFO?30005" 
    await newData.save()    
    return res.redirect('back')
    
}

// render register patient hbs
const getRegisterPage = (req, res) => {
    
    return res.render('clinicianRegisterPatient', {clinicianItem: req.user.toJSON(), flash: req.flash('errors')})
}

// insert new Patient into database and link to clinician
const insertPatient= async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsFound = validationResult(req).array()
        // console.log(errorsFound)
        req.flash('errors', errorsFound);
        return res.redirect('/clinician/registerPatient')
        // return res.send(errors) // if validation errors, do not process data
    }


    // saves patient into mongoDB
    const newPatient = new Patient(req.body)

    const customUsername = (newPatient.first_name.toLowerCase().slice(0, 3) + newPatient.last_name.toLowerCase().slice(0, 3))

    const dobDate = newPatient.dob.getDate()
    const dobMonth = newPatient.dob.getMonth()
    newPatient.screen_name = (customUsername + dobDate + dobMonth) 
    newPatient.password = "INFO?30005" 

    const glucose_th = new Threshold({type: "glucose"});
    const weight_th = new Threshold({type: "weight"}); 
    const insulin_th = new Threshold({type: "insulin"});
    const steps_th = new Threshold({type: "steps"}); 
    
    newPatient.threshold_list.splice(0, 0, glucose_th, steps_th, weight_th, insulin_th)
    // change order of this later, steps will be last

    // pushes patient into clinician's patient list in mongoDB
    Clinician.findByIdAndUpdate(req.user._id,
        {$push: {patient_list: newPatient}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                return res.redirect('/clinician/404')
            } else {
            }
        }
    )

    await newPatient.save()

    // redirects back to clinician home page
    return res.redirect('/clinician/dashboard');

}

// render patient list belonging to the clinician
const getClinicianPatientList =  async (req, res, next) => {

        // reset patient selected by clincian
        req.user.select_patients = ''
        req.user.save()

        // array to collect patient data
        var patients = req.user.patient_list
        var test = [];
        //var patientList = [];
        //var data = [];

        // checks if clinician has patient or not, this is for testing purposes
        if (!patients) {
            return res.render('clinicianPatientList', { clinicianItem: req.user.toJSON(), patientItem: patientList})
        } 

        // loops through the list of patients from clinician to extract input data
        for (var i in patients) {
            patientID = patients[i]._id.toString()
            var hasToday = false;

            const patient = await Patient.findById(patientID).lean()

            if (patient) {

                // finds patient's data input for that day
                for (j in patient.input_data){
            
                    if ((compareDates(patient.input_data[j].set_date) && (hasToday == false))) {
                        //console.log('existing patient insert today's data')
                        test.push([patient, patient.input_data[j], patient.threshold_list])
                        var hasToday = true;
                    }
                }

                // checks if patient has any data_set for that day
                if (hasToday == false) {
                    const patientData = new DataSet({set_date: todaysDate})
                
                    Patient.findByIdAndUpdate(patientID,
                        {$push: {input_data: patientData}},
                        {safe: true, upsert: true},
                        function(err, doc) {
                            if(err){
                                return res.redirect('/clinician/404')
                            }else{
                            }
                        }
                    )
                    
                    // insert default data_set into the patient if it does not exist yet for that day
                    const n = patient.input_data.length
                    test.push([patient, patient.input_data[n], patient.threshold_list])
                    
                }
            }
        }
        return res.render('clinicianPatientList', { clinicianItem: req.user.toJSON(), testData: test})
    
}

// render patient comments hbs with comments from clinician's patients
const getPatientComments = async (req, res, next) => {
    // reset patient selected by clincian
    req.user.select_patients = ''
    await req.user.save()

    const clinician = req.user.toJSON()

    var patients = clinician.patient_list
    var inputList = [];
    for (var i in patients) {
        patientID = patients[i]._id.toString()
        const patient = await Patient.findById(patientID).lean()
        commentList = []

        if (patient) {
            const patient_data = patient.input_data
            for (dataSet in patient_data) {
                daily_data = patient_data[dataSet]

                for (data in daily_data) {
                    if (daily_data[data]) {
                        try {
                            if (daily_data[data].data_comment) {
                                commentList.push(daily_data[data])
                            }
                        } catch(err) {
                            //console.log("not data input")
                        }
                    }
                }
            }
            if (commentList) {
                inputList.push([patient, commentList])
            }
        }
    }

    //console.log(inputList)
    
    return res.render('allPatientComments', { clinicianItem: req.user.toJSON(), commentsList: inputList})
}

// set patient for clinician
const postClinicianPatient = async (req, res, next) => {

    var patientID = req.body.patient.toString().slice(0, -1)

    req.user.select_patients = patientID
    if (await req.user.save()) {

        return res.redirect('/clinician/clinicianViewPatient')
    }
}

// render patient profile for clinician
const getClinicianPatient = async (req, res, next) => {

    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()
    var threshold = patient.threshold_list

    try {
        const sortedInputs = []
        const graphInputs = []
        const glucoseGraph = []
        const weightGraph = []
        const insulinGraph = []
        const stepsGraph = []

        const inputs = patient.input_data
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){
            sortedInputs.push(inputs[i])

            if (inputs.length >= 7) {
                //console.log(inputs.length)
                if ((inputs.length-7) <= i) {

                    date = formatter.formatToParts(inputs[i].set_date)
                    dataDate = date[4].value.toString() + " " + date[2].value.toString()
                    //console.log(dataDate)
 
                    if (inputs[i].glucose_data) {
                    
                        glucoseGraph.push([dataDate, inputs[i].glucose_data.data_entry])
                    } else {
                        glucoseGraph.push([dataDate, inputs[i].glucose_data])
                    }

                    if (inputs[i].weight_data) {
                        weightGraph.push([dataDate, inputs[i].weight_data.data_entry])
                    } else {
                        weightGraph.push([dataDate, inputs[i].weight_data])
                    }

                    if (inputs[i].insulin_data) {
                        insulinGraph.push([dataDate, inputs[i].insulin_data.data_entry])
                    } else {
                        insulinGraph.push([dataDate, inputs[i].insulin_data])
                    }

                    if (inputs[i].steps_data) {
                        stepsGraph.push([dataDate, inputs[i].steps_data.data_entry])
                    } else {
                        stepsGraph.push([dataDate, inputs[i].steps_data])
                    }

                }

            } else {

                if (inputs[i].glucose_data) {
                    
                    glucoseGraph.push([dataDate, inputs[i].glucose_data.data_entry])
                } else {
                    glucoseGraph.push([dataDate, inputs[i].glucose_data])
                }

                if (inputs[i].weight_data) {
                    weightGraph.push([dataDate, inputs[i].weight_data.data_entry])
                } else {
                    weightGraph.push([dataDate, inputs[i].weight_data])
                }

                if (inputs[i].insulin_data) {
                    insulinGraph.push([dataDate, inputs[i].insulin_data.data_entry])
                } else {
                    insulinGraph.push([dataDate, inputs[i].insulin_data])
                }

                if (inputs[i].steps_data) {
                    stepsGraph.push([dataDate, inputs[i].steps_data.data_entry])
                } else {
                    stepsGraph.push([dataDate, inputs[i].steps_data])
                }
            }
        }
        //console.log(stepsGraph)

        return res.render('clinicianViewPatient', { clinicianItem: req.user.toJSON(), patientItem: patient, thresholdItem: threshold, dataItem: sortedInputs, glucoseItem: glucoseGraph, weightItem: weightGraph, insulinItem: insulinGraph, stepsItem: stepsGraph})

    } catch(err) {
        // error detected, renders patient error page
        return res.redirect('/clinician/404')
    }

}


// render patient notes for clinician
const getClinicianPatientNotes = async (req, res, next) => {

    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()
    //console.log(patient.clincian_notes)
    var notesList = []

    if (patient) {
        for (i in patient.clinician_notes) {
            notesList.push(patient.clinician_notes[i])
        }
        //console.log(notesList)
    }

    return res.render('clinicianNotesPatient', { clinicianItem: req.user.toJSON(), patientItem: patient, noteItem: notesList})
}

// render patient notes input for clinician
const getClinicianPatientNotesInput = async (req, res, next) => {
    
    //console.log(req.body.patient.toString().slice(0, -1))
    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()

    // redirects back to clinician home page
    return res.render('clinicianNotesInput', { clinicianItem: req.user.toJSON(), patientItem: patient, date: todaysDate, flash: req.flash('errors')})
}

// posts patient notes input for clinician
// checks if inputs are valid
const postClinicianPatientNotesInput = async (req, res, next) => {

    // checks if input is valid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsFound = validationResult(req).array()
        // console.log(errorsFound)
        req.flash('errors', errorsFound);
        return res.redirect('/clinician/clinicianNotesPatientInput')
        // return res.send(errors) // if validation errors, do not process data
    }
    
    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()

    if (req.body.note) {
        // clinician sends new clinician notes
        const newNote = new Note({note_content: req.body.note, note_date: new Date()})
        // pushes this input_data into the patient in mongoDB
        Patient.updateOne({ _id: patientID},
            {$push: {clinician_notes: newNote}},

            {safe: true, upsert: true, new: true},
            function(err, doc) {
                if(err) {
                    return res.redirect('/clinician/404')
                }else {
                
                }
            }
        )
    }

    return res.redirect('/clinician/clinicianNotesPatient')
}


// render support message for clinician
const getClinicianPatientSupport = async (req, res, next) => {
    
    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()

    if (patient) {
        var message = patient.clinician_message
    } else {
        return res.redirect('/clinician/404')
    }

    return res.render('clinicianSupportPatient', { clinicianItem: req.user.toJSON(), patientItem: patient, messageItem: message, flash: req.flash('errors')})
}

// post support message for clinician
// checks if input is valid
const postClinicianPatientSupport = async (req, res, next) => {

    // checks if input is valid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsFound = validationResult(req).array()
        // console.log(errorsFound)
        req.flash('errors', errorsFound);
        return res.redirect('/clinician/clinicianSupportPatient')
        // return res.send(errors) // if validation errors, do not process data
    }

    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()

    // clinician sends new support message for patient
    if (req.body.message) {
        // pushes this input_data into the patient in mongoDB
        Patient.updateOne({ _id: patientID},
            {$set: {clinician_message: req.body.message.toString()}},

            {safe: true, upsert: true, new: true},
            function(err, doc) {
                if(err) {
                    return res.redirect('/clinician/404')
                }else {
                
                }
            }
        )
    }



    return res.redirect('/clinician/clinicianSupportPatient')
}

// render support message for clinician
const getClinicianPatientThresholdInput = async (req, res, next) => {
    
    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()

    if (patient) {
        var threshold = patient.threshold_list
        //console.log(threshold)
    } else {
        return res.redirect('/clinician/404')
    }

    return res.render('clinicianThresholdPatient', { clinicianItem: req.user.toJSON(), patientItem: patient, thresholdItem: threshold, flash: req.flash('errors')})
}

// post threshold data for patient set by clinician
const postClinicianPatientThresholdInput = async (req, res, next) => {

    // checks if input is valid
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsFound = validationResult(req).array()
        // console.log(errorsFound)
        req.flash('errors', errorsFound);
        return res.redirect('/clinician/clinicianThresholdPatient')
        // return res.send(errors) // if validation errors, do not process data
    }

    var patientID = req.user.select_patients
    const patient = await Patient.findById(patientID).lean()
    thresh_list = []
    //console.log(req.body)

    //th_required: req.body.glucose_required

    if (req.body.glucose_required) {
        const glucose_th = new Threshold({type: "glucose", high: req.body.glucose_high, low: req.body.glucose_low});
        thresh_list.push(glucose_th)
    } else {
        const glucose_th = new Threshold({type: "glucose", high: req.body.glucose_high, low: req.body.glucose_low, th_required: false});
        thresh_list.push(glucose_th)
    }

    if (req.body.steps_required) {
        const steps_th = new Threshold({type: "steps", high: req.body.steps_high, low: req.body.steps_low}); 
        thresh_list.push(steps_th)
    } else {
        const steps_th = new Threshold({type: "steps", high: req.body.steps_high, low: req.body.steps_low, th_required:false}); 
        thresh_list.push(steps_th)
    }

    if (req.body.weight_required) {
        const weight_th = new Threshold({type: "weight", high: req.body.weight_high, low: req.body.weight_low}); 
        thresh_list.push(weight_th)
    } else {
        const weight_th = new Threshold({type: "weight", high: req.body.weight_high, low: req.body.weight_low, th_required: false}); 
        thresh_list.push(weight_th)
    }

    if (req.body.insulin_required) {
        const insulin_th = new Threshold({type: "insulin", high: req.body.insulin_high, low: req.body.insulin_low});
        thresh_list.push(insulin_th)
    } else {
        const insulin_th = new Threshold({type: "insulin", high: req.body.insulin_high, low: req.body.insulin_low, th_required: false});
        thresh_list.push(insulin_th)
    }

    // clinician updates patient threshold
    // pushes this thresh_list into the patient in mongoDB
    Patient.updateOne({ _id: patientID},
        {$set: {threshold_list: thresh_list}},

        {safe: true, upsert: true, new: true},
        function(err, doc) {
            if(err) {
                return res.redirect('/clinician/404')
            }else {
                
            }
        }
    )
    

    return res.redirect('/clinician/clinicianViewPatient')
}

// Function to update patient's password
const updatePass = async (req,res) =>{

    try {
        
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const errorsFound = validationResult(req).array()
            req.flash('errors', errorsFound);
            return res.redirect('/clinician/change-password')
        }

        // hash the password using bcrypt before saving to mongodb
        const hashed_pass = await bcrypt.hash(req.body.password, SALT_FACTOR)
        Clinician.findOneAndUpdate(
            { _id: req.user._id},
            {password: hashed_pass},
            function(err, doc) {
                if (err) {
                    return res.redirect('/clinician/404')
                } else {
                      
                }
            }
        )
    
        return res.redirect('/clinician/dashboard')
        

    } catch(err) {
        // error detected, renders patient error page
        console.log(err);
        return res.redirect('/clinician/404')
    }
}

const getChangePass = (req, res)=>{
    return res.render('clinicianPass', {flash: req.flash('errors')})
}
// Function to retrieve patient's error page
const getErrorPage = (req,res)=>{
    return res.render('clinician404')
}


// function used by fetch API for graph
const getGlucoseData = async (req, res, next) => {
    var patientID = req.user.select_patients
    var patient = await Patient.findById(patientID).lean()
    try {
        const glucoseGraph = []
        const inputs = patient.input_data
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){

            if (inputs.length >= 7) {
                if ((inputs.length-7) <= i) {

                    date = formatter.formatToParts(inputs[i].set_date)
                    dataDate = date[4].value.toString() + " " + date[2].value.toString()
                    //console.log(dataDate)

                    if (inputs[i].glucose_data) {
                        glucoseGraph.push([dataDate, inputs[i].glucose_data.data_entry])
                    } else {
                        glucoseGraph.push([dataDate, inputs[i].glucose_data])
                    }
                }

            } else {

                if (inputs[i].glucose_data) {
                    glucoseGraph.push([dataDate, inputs[i].glucose_data.data_entry])
                } else {
                    glucoseGraph.push([dataDate, inputs[i].glucose_data])
                }
            }
        }
        res.send(glucoseGraph)

    } catch(err) {
        // error detected, renders patient error page
        console.log(err);
        return res.redirect('/clinician/404')
    }
}


// function used by fetch API for graph
const getWeightData = async (req, res, next) => {

    var patientID = req.user.select_patients
    var patient = await Patient.findById(patientID).lean()

    try {
        const weightGraph = []
        const inputs = patient.input_data
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){

            if (inputs.length >= 7) {
                if ((inputs.length-7) <= i) {

                    date = formatter.formatToParts(inputs[i].set_date)
                    dataDate = date[4].value.toString() + " " + date[2].value.toString()
                    //console.log(dataDate)

                    if (inputs[i].weight_data) {
                        weightGraph.push([dataDate, inputs[i].weight_data.data_entry])
                    } else {
                        weightGraph.push([dataDate, inputs[i].weight_data])
                    }
                }

            } else {

                if (inputs[i].weight_data) {
                    weightGraph.push([dataDate, inputs[i].weight_data.data_entry])
                } else {
                    weightGraph.push([dataDate, inputs[i].weight_data])
                }
            }
        }
        res.send(weightGraph)

    } catch(err) {
        // error detected, renders patient error page
        console.log(err);
        return res.redirect('/clinician/404')
    }
}


// function used by fetch API for graph
const getInsulinData = async (req, res, next) => {
    
    var patientID = req.user.select_patients
    var patient = await Patient.findById(patientID).lean()
    
    try {
        const insulinGraph = []
        const inputs = patient.input_data
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){

            if (inputs.length >= 7) {
                if ((inputs.length-7) <= i) {

                    date = formatter.formatToParts(inputs[i].set_date)
                    dataDate = date[4].value.toString() + " " + date[2].value.toString()
                    //console.log(dataDate)

                    if (inputs[i].insulin_data) {
                        insulinGraph.push([dataDate, inputs[i].insulin_data.data_entry])
                    } else {
                        insulinGraph.push([dataDate, inputs[i].insulin_data])
                    }
                }

            } else {

                if (inputs[i].insulin_data) {
                    insulinGraph.push([dataDate, inputs[i].insulin_data.data_entry])
                } else {
                    insulinGraph.push([dataDate, inputs[i].insulin_data])
                }
            }
        }
        res.send(insulinGraph)

    } catch(err) {
        // error detected, renders patient error page
        console.log(err);
        return res.redirect('/clinician/404')
    }
}

// function used by fetch API for graph
const getStepsData = async (req, res, next) => {

    var patientID = req.user.select_patients
    var patient = await Patient.findById(patientID).lean()
    
    try {
        const stepsGraph = []
        const inputs = patient.input_data
        // sort inputs in descending order according to date
        for (var i = inputs.length - 1; i>=0; i--){

            if (inputs.length >= 7) {
                if ((inputs.length-7) <= i) {

                    date = formatter.formatToParts(inputs[i].set_date)
                    dataDate = date[4].value.toString() + " " + date[2].value.toString()
                    //console.log(dataDate)

                    if (inputs[i].steps_data) {
                        stepsGraph.push([dataDate, inputs[i].steps_data.data_entry])
                    } else {
                        stepsGraph.push([dataDate, inputs[i].steps_data])
                    }
                }

            } else {

                if (inputs[i].steps_data) {
                    stepsGraph.push([dataDate, inputs[i].steps_data.data_entry])
                } else {
                    stepsGraph.push([dataDate, inputs[i].steps_data])
                }
            }
        }
        res.send(stepsGraph)

    } catch(err) {
        // error detected, renders patient error page
        console.log(err);
        return res.redirect('/clinician/404')
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getClinicianLoginPage,
    clinicianLogin,
    clinicianLogout,
    getClinicianById,
    getAllClinicians,
    insertClinician,
    insertPatient,
    getRegisterPage,
    getClinicianPatientList,
    getPatientComments,
    postClinicianPatient,
    getClinicianPatient,
    getClinicianPatientNotes,
    getClinicianPatientNotesInput,
    postClinicianPatientNotesInput,
    getClinicianPatientSupport,
    postClinicianPatientSupport,
    getClinicianPatientThresholdInput,
    postClinicianPatientThresholdInput,
    getErrorPage,
    getChangePass,
    updatePass,
    getGlucoseData,
    getWeightData,
    getInsulinData,
    getStepsData,

}


   
