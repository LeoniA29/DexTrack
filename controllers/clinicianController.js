const Clinician = require('../models/clinician')
const Patient = require('../models/patient')

const getAllClinicians = async (req, res, next) => {
 try {
 const clinicians = await Clinician.find().lean()
 return res.render('allClinicians', { data: clinicians })
 } catch (err) {
 return next(err)
 }
}

const getClinicianById = async(req, res, next) => {
 try {
 const clinician = await Clinician.findById(req.params.clinician_id).lean()
 if (!clinician) {
 // no author found in database
 return res.sendStatus(404)
 }
 // found person
 return res.render('oneData', { oneItem: clinician })
 } catch (err) {
 return next(err)
 }
}

const insertClinician= (req, res) => {
    var newData = new Clinician(req.body)
    /* use validation in-between */
    newData.save()    
    return res.redirect('back')
}


// render register patient hbs
const registerPatient = (req, res) => {
    return res.render('patientRegister')
}

// trying to insertPatient into database and link to clinician
const insertPatient= (req, res) => {

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

// render patient list hbs
const getClinicianPatientList =  async (req, res, next) => {
    try {
        const clinician = await Clinician.findById(req.params.clinician_id).lean()
        if (!clinician) {
            // no clinician found in database
            return res.sendStatus(404)
        }
        
        return res.render('clinicianPatientList', { oneItem: clinician })
    
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


   
