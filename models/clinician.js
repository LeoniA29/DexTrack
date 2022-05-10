const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const clinicianSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    first_name: String,
    last_name: String,
    role: {
        type: String,
        default: "clinician"
    },
    patient_list: [ObjectId]
})

// password comparison function
clinicianSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
 }
 
 const SALT_FACTOR = 20
 
// hash password before saving
clinicianSchema.pre('save', function save(next) {
    const patient = this// go to next if password field has not been modified
    if (!patient.isModified('password')) {
        return next()
    }
 
    // auto-generate salt/hash
    // console.log(patient.password)
    bcrypt.hash(patient.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        //replace password with hash
        patient.password = hash
        next()
    })
})

const Clinician = mongoose.model('Clinician', clinicianSchema)
module.exports = Clinician