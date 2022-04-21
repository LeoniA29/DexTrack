const Patient = require('../models/patient')
const PatientData = require('../models/patientData')

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
    
    return res.render('oneData', { oneItem: patient })

    } catch (err) {
    return next(err)
    }
}

const insertPatientData= (req, res) => {
    
    const ObjectId = require('mongodb').ObjectId
    var newData = new PatientData(req.body)
    newData.save()

    var id1 = req.params.patient_id
    var id2 = newData.id
    var objectId1 = new ObjectId(id1)
    var objectId2 = new ObjectId(id2)

    Patient.findByIdAndUpdate(objectId1,
        {$push: {data_inputs: objectId2}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            //do stuff
            }
        }
    )
    return res.redirect('back');
}
   
// exports an object, which contain functions imported by router
module.exports = {
    getAllPatients,
    insertPatient,
    insertPatientData,
    getPatientById
}


   
