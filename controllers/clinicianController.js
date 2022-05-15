const Clinician = require('../models/clinician')
const {Patient, Data, DataSet, Threshold, Note} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId

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
const {validationResult, check } = require('express-validator')

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
    /* use validation in-between */
    const customUsername = (newData.first_name.slice(0, 3) + newData.last_name.slice(0, 3))
    newData.username += customUsername
    await newData.save()    
    return res.redirect('back')
}

// render register patient hbs
const getRegisterPage = (req, res) => {
    return res.render('patientRegister', {flash: req.flash('errors')})
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
    
    const glucose_th = new Threshold({type: "glucose"});
    const steps_th = new Threshold({type: "steps"}); 
    const weight_th = new Threshold({type: "weight"}); 
    const insulin_th = new Threshold({type: "insulin"});
    
    newPatient.threshold_list.splice(0, 0, glucose_th,steps_th,weight_th, insulin_th)
    const customUsername = (newPatient.first_name.slice(0, 3) + newPatient.last_name.slice(0, 3))
    newPatient.username += customUsername

    const dobDate = newPatient.dob.getDate()
    const dobMonth = newPatient.dob.getMonth()
    newPatient.screen_name = (customUsername + dobDate + dobMonth) 

    // pushes patient into clinician's patient list in mongoDB
    Clinician.findByIdAndUpdate(req.user._id,
        {$push: {patient_list: newPatient}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            }
        }
    )
    
    await newPatient.save()

    // redirects back to clinician home page
    return res.redirect('/clinician/dashboard');

}

// render patient list belonging to the clinician
const getClinicianPatientList =  async (req, res, next) => {

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
            
                    if (compareDates(patient.input_data[j].set_date)) {
                        //console.log('existing patient insert today's data')
                        test.push([patient, patient.input_data[j], patient.threshold_list])
                        var hasToday = true;
                    }
                }

                // checks if patient has any data_set for that day
                if (hasToday == false) {
                    const patientData = new DataSet({set_date: new Date()})
                
                    Patient.findByIdAndUpdate(patientID,
                        {$push: {input_data: patientData}},
                        {safe: true, upsert: true},
                        function(err, doc) {
                            if(err){
                                console.log(err);
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
        //console.log(patients[i]._id.toString())
        // console.log(patientList)
        //console.log(data)
        // console.log(test)
        return res.render('clinicianPatientList', { clinicianItem: req.user.toJSON(), testData: test})
    
}

// render patient comments hbs with comments from clinician's patients
const getPatientComments = async (req, res, next) => {
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

                //console.log(daily_data)
                for (data in daily_data) {
                    if (daily_data[data]) {
                        try {
                            if (daily_data[data].data_comment) {
                                //console.log(daily_data[data].data_comment)
                                commentList.push(daily_data[data])
                            }
                        } catch(err) {
                            console.log("not data input")
                        }
                    }
                }
            }
            if (commentList) {
                inputList.push([patient, commentList])
            }
        }
    }

    console.log(inputList)
    
    return res.render('allPatientComments', { clinicianItem: req.user.toJSON(), commentsList: inputList})
}

// render patient comments hbs with comments from clinician's patients
const getClinicianPatient = async (req, res, next) => {
    
    //console.log(req.body.patient.toString().slice(0, -1))
    var patientID = req.body.patient.toString().slice(0, -1)
    const patient = await Patient.findById(patientID).lean()


    

    return res.render('clinicianViewPatient', { clinicianItem: req.user.toJSON(), patientItem: patient})
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
    getClinicianPatient,
}


   
