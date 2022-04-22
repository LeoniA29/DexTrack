// import patient model
const Patient = require('../models/patient')

// handle request to get all people data instances
const getAllPatientData = async (req, res, next) => {
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
        return res.render('oneData', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}


// exports an object, which contain functions imported by router
module.exports = {
    getAllPatientData,
    getPatientById,
}

