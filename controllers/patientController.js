const {Patient, DataSet, Data} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId
const todaysDate = new Date();

const getAllPatients = async (req, res, next) => {
    try {
    const patients = await Patient.find().lean()
    return res.render('allPatients', { data: patients })
    } catch (err) {
    return next(err)
    }
   }

const getPatientById = async(req, res, next) => {

    try {
    const patient = await Patient.findById(req.params.patient_id).lean()
    if (!patient) {
    // no author found in database
    return res.sendStatus(404)
    }

    
    for (i in patient.input_data){
        
        if (patient.input_data[i].set_date == undefined) {
            break;
        }

        if ( patient.input_data[i].set_date.getDate() == todaysDate.getDate() ) {
            return res.render('onePatient', { oneItem: patient, twoItem: patient.input_data[i]} )
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
    return res.render('onePatient', { oneItem: patient, twoItem: patient.input_data[n]})

    } catch (err) {
    return next(err)
    }
}

const getGlucosePage= async (req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    

    for (i in patient.input_data) {
        
         if ( (patient.input_data[i].set_date.getDate() == todaysDate.getDate()) && (patient.input_data[i].glucose_data != null) ) {
        
            return res.redirect('/home/patient/'+ req.params.patient_id)
        }
    }

    return res.render('insertGlucose', { oneItem: patient })
}

const getInsulinPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()

    for (i in patient.input_data) {
        
        if ( (patient.input_data[i].set_date.getDate() == todaysDate.getDate()) && (patient.input_data[i].insulin_data != null) ) {
           
           return res.redirect('/home/patient/'+ req.params.patient_id)
       }
   }

    return res.render('insertInsulin', { oneItem: patient })
}

const getStepsPage= async(req,res) =>{
    const patient = await Patient.findById(req.params.patient_id).lean()
    for (i in patient.input_data) {
        
        if ( (patient.input_data[i].set_date.getDate() == todaysDate.getDate()) && (patient.input_data[i].steps_data != null) ) {
           
           return res.redirect('/home/patient/'+ req.params.patient_id)
       }
   }
    return res.render('insertSteps', { oneItem: patient})
}

const getWeightPage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    for (i in patient.input_data) {
        
        if ( (patient.input_data[i].set_date.getDate() == todaysDate.getDate()) && (patient.input_data[i].weight_data != null) ) {
           
           return res.redirect('/home/patient/'+ req.params.patient_id)
       }
   }
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
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
                        }
                    }
                )
            }

            if (req.body.data_type == "steps") {
                // console.log("steps data")
                    
                Patient.updateOne(
                { _id: objectId1, "input_data._id": objectId2},
                { $set: {"input_data.$.steps_data": newData}},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
                        }
                    }
                )
            }

            if (req.body.data_type == "weight") {
                // console.log("weight data")
                    
                Patient.updateOne(
                { _id: objectId1, "input_data._id": objectId2},
                { $set: {"input_data.$.weight_data": newData}},
                function(err, doc) {
                     if(err){
                        console.log(err);
                    }else{
                        //do stuff
                        }
                    }
                )
            }

            if (req.body.data_type == "insulin") {
                // console.log("insulin data")
                    
                Patient.updateOne(
                {_id: objectId1,"input_data._id": objectId2},
                {$set: {"input_data.$.insulin_data": newData}},
                function(err, doc) {
                    if(err){
                        console.log(err);
                    }else{
                        //do stuff
                        }
                    }
                ) 
            }
        }
    }

    return res.redirect('/home/patient/' + req.params.patient_id)
}
   

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
    insertPatientData,
    getPatientById,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage
}


   
