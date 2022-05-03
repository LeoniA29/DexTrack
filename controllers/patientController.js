<<<<<<< HEAD
// schema models imported
const {Patient, DataSet, Threshold, Data} = require('../models/patient')
=======
const {Patient, DataSet, Data} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId
const todaysDate = new Date();
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003

const ObjectId = require('mongodb').ObjectId // ObjectID constant 
const todaysDate = new Date(); // today's date constant 


// retrieve all existing patients
const getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        return res.render('allPatients', { data: patients })
    } catch (err) {
        return next(err)
    }
<<<<<<< HEAD
}

// function to retrieve a patient's dashboard using their patient ID
=======
   }

>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
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
                return res.render('patientDashboard', { patient: patient, patientData: patient.input_data[i]} )
        }

    }

<<<<<<< HEAD
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
        return res.render('patientDashboard', { patient: patient, patientData: patient.input_data[n]})
=======
    
    for (i in patient.input_data){
        
        if (patient.input_data[i].set_date == undefined) {
            break;
        }

        if ( patient.input_data[i].set_date.getDate() == todaysDate.getDate() ) {
            return res.render('patientDashboard', { oneItem: patient, twoItem: patient.input_data[i]} )
        }

    }

    
    const patientData = new DataSet({set_date: todaysDate})

    var id1 = req.params.patient_id
    var objectId1 = new ObjectId(id1)

    Patient.findByIdAndUpdate(objectId1,
        {$push: {input_data: patientData}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            //do stuff
            }
        }
    )
    // console.log("new dataset for today")
    const n = patient.input_data.length
    // console.log(n)
    return res.render('test', { oneItem: patient, twoItem: patient.input_data[n]})
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003

    } catch (err) {
        return next(err)
    }
}

<<<<<<< HEAD
// function to retrieve glucose submission page of a patient
const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    return res.render('insertGlucose', { patient: patient })
}

// function to retrieve insulin submission page of a patient
const getInsulinPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertInsulin', { patient: patient })
}
// function to retrieve steps submission page of a patient
const getStepsPage= async(req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    return res.render('insertSteps', { patient: patient})
}

// function to retrieve weight submission page of a patient
const getWeightPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertWeight', { patient: patient })
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
=======
const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    /*
    for (i in patient.input_data) {
         if ( (patient.input_data[i].set_date.getDate() == todaysDate.getDate()) && (patient.input_data[i].glucose_data != null) ) {
            return res.redirect('/home/patient/'+ req.params.patient_id)
        }
    }
    */
    return res.render('insertGlucose', { oneItem: patient })
}

const getInsulinPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertInsulin', { oneItem: patient })
}

const getStepsPage= async(req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    return res.render('insertSteps', { oneItem: patient})
}

const getWeightPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    return res.render('insertWeight', { oneItem: patient })
}


const insertPatientData= async(req, res) => {

    var id1 = req.params.patient_id
    var objectId1 = new ObjectId(id1)

    const patient = await Patient.findById(req.params.patient_id).lean()

    var newData = new Data(req.body)
    // console.log(newData)

    for (i in patient.input_data){
        
        if ( patient.input_data[i].set_date.getDate() == todaysDate.getDate() ) {
            const inputID = patient.input_data[i]._id
            var objectId2 = new ObjectId(inputID)

            if (req.body.data_type == "glucose") {
                // console.log("glucose data")
                    
                Patient.updateOne(
                { _id: objectId1, "input_data._id": objectId2 },
                {$set: {"input_data.$.glucose_data": newData}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
                        }
                    }
                )
            }

<<<<<<< HEAD
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
=======
            if (req.body.data_type == "steps") {
                // console.log("steps data")
                    
                Patient.updateOne(
                { _id: objectId1, "input_data._id": objectId2},
                { $set: {"input_data.$.steps_data": newData}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
                        }
                    }
                )
            }

<<<<<<< HEAD
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
=======
            if (req.body.data_type == "weight") {
                // console.log("weight data")
                    
                Patient.updateOne(
                { _id: objectId1, "input_data._id": objectId2},
                { $set: {"input_data.$.weight_data": newData}},
                {safe: true, upsert: true},
                function(err, doc) {
                     if(err){
                        console.log(err);
                    }else{
                        //do stuff
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
                        }
                    }
                )
            }

<<<<<<< HEAD
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
=======
            if (req.body.data_type == "insulin") {
                // console.log("insulin data")
                    
                Patient.updateOne(
                {_id: objectId1,"input_data._id": objectId2},
                {$set: {"input_data.$.insulin_data": newData}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
                        }
                    }
                ) 
            }
<<<<<<< HEAD

        }
    }

    // redirect patient to the dashboard page
    return res.redirect('/patient/' + req.params.patient_id)
    } catch (err) {
        return next(err)
    }
}


// exports objects containing functions imported by router
module.exports = {
    getAllPatients, 
=======
        }
    }

    return res.redirect('/home/patient/' + req.params.patient_id)
}
   

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
    insertPatientData,
    getPatientById,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage
}


   
