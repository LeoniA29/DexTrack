const Clinician = require('../models/clinician')
const {Patient, DataSet, Data} = require('../models/patient')

const ObjectId = require('mongodb').ObjectId
const todaysDate = new Date();


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
const insertPatient= async (req, res) => {

    const ObjectId = require('mongodb').ObjectId

    var newPatient = new Patient(req.body)
    newPatient.save()  

    var clinician = req.params.clinician_id
    var object_clinician = new ObjectId(clinician)

    Clinician.findByIdAndUpdate(object_clinician,
        {$push: {patient_list: newPatient}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
                return res.redirect('/clinician/'+ req.params.clinician_id);
            }
        }
    )
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
        var test = [];
        var patientList = [];
        var data = [];

        if (!patients) {
            return res.render('clinicianPatientList', { clinicianItem: clinician, patientItem: patientList})
        } 

        for (var i in patients) {
            patientID = patients[i]._id.toString()

            const patient = await Patient.findById(patientID).lean()

            if (patient) {
                patientList.push(patient)
                console.log(patient.input_data.length)
                
                if (patient.input_data.length == 0) {
                    const patientData = new DataSet({set_date: todaysDate})
                
                    Patient.findByIdAndUpdate(patientID,
                        {$push: {input_data: patientData}},
                        {safe: true, upsert: true},
                        function(err, doc) {
                            if(err){
                                console.log(err);
                            }else{
                                console.log("insertdata into patient test now")
                                const n = patient.input_data.length
                                test.push([patient, patient.input_data[n]])
                                console.log("did it succeed?")
                            }
                        }
                    )
                }
                for (j in patient.input_data){
            
                    if (patient.input_data[j].set_date.getDate() == todaysDate.getDate() ) {
                        console.log('old patient insert old data')
                        data.push(patient.input_data[j])
                        test.push([patient, patient.input_data[j]])
                    }
                }
            }
        }
        //console.log(patients[i]._id.toString())
        //console.log(patientList)
        //console.log(data)
        console.log(test)
        return res.render('clinicianPatientList', { clinicianItem: clinician, patientItem: patientList, patientData: data, testData: test})

    
    } catch (err) {
        return next(err)
    }
}
const insertInputData = (patient, test) => {
    const n = patient.input_data.length
    test.push([patient, patient.input_data[n]])
    console.log('new patient make new null')
}
const makeDataSet = async (patient, patientID) => {
    const patientData = new DataSet({set_date: todaysDate})

    var patientObjectID = new ObjectId(patientID)
    var data_boolean = false

    Patient.findByIdAndUpdate(patientObjectID,
        {$push: {input_data: patientData}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                console.log(err);
            }else{
                console.log("input_data made")
                console.log("input_data made again in here but cannot?")
            }
        }
    )
    
    console.log("pass patient function")
    if (patient.input_data.length == 1) {
        data_boolean = true
    }

    return new Promise ((resolve, reject) => {
        if (data_boolean) {
            resolve(data_boolean)
        } else {
            reject('input_data not successfully made')
        }
    })
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


   
