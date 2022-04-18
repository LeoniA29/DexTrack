// import patient model
const Patient = require('../models/Patient')

// handle request to get all people data instances
const getAllPatientData = async (req, res, next) => {
    try {
        const patientList = await Patient.find().lean()
        return res.render('allData', { data: patientList })
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async(req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.Patient_id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

// trying to insertData into database
const insertData = (req, res) => {
    var newPatient = new Patient(req.body)
    newPatient.save()
    return res.redirect('back')
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getDataById,
    insertData,
}
