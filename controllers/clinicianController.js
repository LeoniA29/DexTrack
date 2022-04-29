const Clinician = require('../models/clinician')
const {Patient, Data, DataSet, Threshold} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId
const todaysDate = new Date();

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
const registerPatient = (req, res) => {
    const clinician = Clinician.findById(req.params.clinician_id).lean()
    return res.render('patientRegister', { oneItem: clinician})
}

// insert new Patient into database and link to clinician
const insertPatient= async (req, res) => {

    // saves patient into mongoDB
    var newPatient = new Patient(req.body)
    await newPatient.save()  

    // initializing all thresholds for the patient
    var thresholds = []
    var glucose_th = new Threshold({type: "glucose"}); thresholds.push(glucose_th);
    var steps_th = new Threshold({type: "steps"}); thresholds.push(steps_th);
    var weight_th = new Threshold({type: "weight"}); thresholds.push(weight_th);
    var insulin_th = new Threshold({type: "insulin"}); thresholds.push(insulin_th);
    
    var ID = newPatient._id;
    var patientID = new ObjectId(ID)
    for (var i in thresholds) {
        // iterates through the thresholds array in push it into the patient's
        // threshold array in mongoDB
        Patient.findByIdAndUpdate(patientID,
            {$push: {threshold_list: thresholds[i]}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                    console.log(err);
                } else{
                }
            }
        )
    }

    
    var clinician = req.params.clinician_id
    var object_clinician = new ObjectId(clinician)

    // pushes patient into clinician's patient list in mongoDB
    Clinician.findByIdAndUpdate(object_clinician,
        {$push: {patient_list: newPatient}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            }
        }
    )

    // redirects back to clinician home page
    return res.redirect('/clinician/'+ req.params.clinician_id);

}

// render patient list belonging to the clinician
const getClinicianPatientList =  async (req, res, next) => {

    try {
        const clinician = await Clinician.findById(req.params.clinician_id).lean()
        if (!clinician) {
            // no clinician found in database
            return res.sendStatus(404)
        }

        // array to collect patient data
        var patients = clinician.patient_list
        var test = [];
        //var patientList = [];
        //var data = [];

        // checks if clinician has patient or not, this is for testing purposes
        if (!patients) {
            return res.render('clinicianPatientList', { clinicianItem: clinician, patientItem: patientList})
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
        //console.log(test)
        return res.render('clinicianPatientList', { clinicianItem: clinician, testData: test})
    
    } catch (err) {
        return next(err)
    }
}
// exports an object, which contain functions imported by router
module.exports = {
    getClinicianById,
    getAllClinicians,
    insertClinician,
    insertPatient,
    registerPatient,
    getClinicianPatientList,
}


   
