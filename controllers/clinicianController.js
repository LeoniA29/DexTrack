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
 // found person and get patient list

 return res.render('oneData', { oneItem: clinician})
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
    const clinician = Clinician.findById(req.params.clinician_id).lean()
    return res.render('patientRegister', { oneItem: clinician})
}

// trying to insertPatient into database and link to clinician
const insertPatient= (req, res) => {

    const ObjectId = require('mongodb').ObjectId

    var newPatient = new Patient(req.body)
    newPatient.save()  
    var input_Patient = newPatient._id

    var clinician = req.params.clinician_id
    var object_clinician = new ObjectId(clinician)

    Clinician.findByIdAndUpdate(object_clinician,
        {$push: {patient_list: newPatient}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
            //do stuff
            }
        }
    )
    return res.redirect('/clinician/'+ req.params.clinician_id);
}

// render patient list hbs
const getClinicianPatientList =  async (req, res, next) => {
    try {
        const clinician = await Clinician.findById(req.params.clinician_id).lean()
        if (!clinician) {
            // no clinician found in database
            return res.sendStatus(404)
        }

        var patients = clinician.patient_list
        var patientList = [];

        for (var i in patients) {
            patientID = patients[i]._id.toString()
            const patient = await Patient.findById(patientID).lean()
            patientList.push(patient)
            //console.log(patients[i]._id.toString())

        }
        console.log(patientList)

        return res.render('clinicianPatientList', { clinicianItem: clinician, patientItem: patientList})
    
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


   
