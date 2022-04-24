// import patient model
const Patient = require('../models/patient')

// handle request to get all people data instances
const getAllPatients = async (req, res, next) => {
    try {
        const patientList = await Patient.find().lean()
        return res.render('allPatients', { data: patientList })
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getPatientById = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('onePatient', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}


const getGlucosePage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertGlucose', { oneItem: patient })
}

const getInsulinPage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertInsulin', { oneItem: patient })
}
const getStepsPage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertSteps', { oneItem: patient })
}
const getWeightPage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertWeight', { oneItem: patient })
}


const insertPatientData= (req, res) => {

    const ObjectId = require('mongodb').ObjectId
    // var newData = new PatientData(req.body)
    // newData.save()

    var id1 = req.params.patient_id
    // var id2 = newData.id
    var objectId1 = new ObjectId(id1)
    // var objectId2 = new ObjectId(id2)

    Patient.findByIdAndUpdate(objectId1,
        {$push: {input_data: req.body}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            //do stuff
            }
        }
    )
    return res.redirect('/patient/'+ req.params.patient_id);
}


// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
    getPatientById,
    insertPatientData,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage,
    
}

