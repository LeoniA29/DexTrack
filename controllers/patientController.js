// schema models imported
const {Patient, DataSet, Threshold, Data} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId // ObjectID constant 
const todaysDate = new Date(); // today's date constant 

// remove later, not need by patients
const getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        return res.render('allPatients', { data: patients })
    } catch (err) {
        return next(err)
    }
   }

// function to retrieve a patient's dashboard using their patient ID
const getPatientById = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        
        if (!patient) {
            return res.sendStatus(404)
        }

        for (i in patient.input_data){
            // iterating through each patient's time-series inputs
            if ( patient.input_data[i].set_date.getDate() == todaysDate.getDate() ) {
                // render today's patient data if found one 
                return res.render('patientDashboard', { oneItem: patient, twoItem: patient.input_data[i]} )
        }

    }

        // it's a new day, create new input_data schema for a patient
        const patientData = new DataSet({set_date: todaysDate})
        
        var id = req.params.patient_id
        var patientID = new ObjectId(id)

        // pushes this input_data into the patient in mongoDB
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

        const n = patient.input_data.length // new input_data entry is pushed at the back of the array 
        return res.render('patientDashboard', { oneItem: patient, twoItem: patient.input_data[n]})

    } catch (err) {
        return next(err)
    }
}

// function to retrieve glucose submission page of a patient
const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    return res.render('insertGlucose', { oneItem: patient })
}

// function to retrieve insulin submission page of a patient
const getInsulinPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertInsulin', { oneItem: patient })
}
// function to retrieve steps submission page of a patient
const getStepsPage= async(req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    return res.render('insertSteps', { oneItem: patient})
}

// function to retrieve weight submission page of a patient
const getWeightPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertWeight', { oneItem: patient })
}


// function to push the inputted data of a patient into it's record on mongoDB
// all submission pages uses this function to do the task
const insertPatientData= async(req, res, next) => {

    // convert patientID into an instance of an object
    var id = req.params.patient_id
    var objectId = new ObjectId(id)

    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
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
                { _id: objectId, "input_data._id": objectInput},
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
                { _id: objectId, "input_data._id": objectInput},
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
                { _id: objectId, "input_data._id": objectInput},
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
                {_id: objectId,"input_data._id": objectInput},
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
    return res.redirect('/patient/' + req.params.patient_id)
    } catch (err) {
        return next(err)
    }
}

const getAboutDextrack= (req, res)=> {
    return res.render('About Dextrack')
}
   

// exports objects containing functions imported by router
module.exports = {
    getAllPatients, // remove later
    insertPatientData,
    getPatientById,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage,
    getAboutDextrack
}


   
