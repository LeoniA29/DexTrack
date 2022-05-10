const Clinician = require('../models/clinician')
const {Patient, Data, DataSet, Threshold} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId
const todaysDate = new Date();

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
    res.redirect('/clinician/login')
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
const insertClinician= (req, res) => {
    var newData = new Clinician(req.body)
    /* use validation in-between */
    newData.save()    
    return res.redirect('back')
}

// render register patient hbs
const getRegisterPage = (req, res) => {
    return res.render('patientRegister')
}

// render patient comments hbs
const getPatientComments = async (req, res, next) => {
    const clinician = Clinician.findById(req.user._id).lean()
    var commentsList = [];

    
    return res.render('patientRegister', { commentsList: patient_comments})
}


// insert new Patient into database and link to clinician
const insertPatient= async (req, res) => {

    // saves patient into mongoDB
    const newPatient = new Patient(req.body)
    
    const glucose_th = new Threshold({type: "glucose"});
    const steps_th = new Threshold({type: "steps"}); 
    const weight_th = new Threshold({type: "weight"}); 
    const insulin_th = new Threshold({type: "insulin"});
    
    newPatient.threshold_list.splice(0, 0, glucose_th,steps_th,weight_th, insulin_th)
    const customUsername = (newPatient.first_name.slice(0, 3) + newPatient.last_name.slice(0, 3))
    newPatient.username += customUsername



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
            
                    if (patient.input_data[j].set_date.getDate() == todaysDate.getDate() ) {
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
    getPatientComments
}


   
