const Patient = require('../models/patient')
const PatientData = require('../models/patientData')
const todaysDate = new Date();

const getAllPatients = async (req, res, next) => {
    try {
    const patients = await Patient.find().lean()
    return res.render('allPatients', { data: patients })
    } catch (err) {
    return next(err)
    }
   }

const insertPatient= (req, res) => {
    var newData = new Patient(req.body)
    /* use validation in-between */
    newData.save()    

    return res.redirect('back')
}

const getPatientById = async(req, res, next) => {
    try {
    const patient = await Patient.findById(req.params.patient_id).lean()
    if (!patient) {
    // no author found in database
    return res.sendStatus(404)
    }
    
    return res.render('onePatient', { oneItem: patient })

    } catch (err) {
    return next(err)
    }
}

const getGlucosePage= async(req,res) =>{
    const patient =  await Patient.findById(req.params.patient_id).lean()
    
    for (var i in patient.input_data){
        var inputs = patient.input_data[i] 
        if ( (inputs.createdAt.getDate() == todaysDate.getDate()) && (inputs.data_type == "glucose") ) {
            return res.redirect('/home/patient/'+ req.params.patient_id)
        }
    }
    
    return res.render('insertGlucose', { oneItem: patient })
}

const getInsulinPage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertInsulin', { oneItem: patient })
}
const getStepsPage=(req,res) =>{
    const patient =  Patient.findById(req.params.patient_id).lean()
    return res.render('insertSteps', { oneItem: patient})
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
    return res.redirect('/home/patient/'+ req.params.patient_id);
}
   

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
    insertPatient,
    insertPatientData,
    getPatientById,
    getGlucosePage,
    getInsulinPage,
    getStepsPage,
    getWeightPage
}


   
