const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const clinicianSchema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 username: {type: String, unique: true},
 password: {type: String},
 secret: {type: String, default: "INFO30005"},
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
 
 const SALT_FACTOR = 10
 
 // hash password before saving
 clinicianSchema.pre('save', function save(next) {
     const clinician = this// go to next if password field has not been modified
     if (!clinician.isModified('password')) {
         return next()
     }
 
     // auto-generate salt/hash
     // console.log(patient.password)
     bcrypt.hash(clinician.password, SALT_FACTOR, (err, hash) => {
         if (err) {
             return next(err)
         }
         //replace password with hash
         clinician.password = hash
         next()
     })
 })


const Clinician = mongoose.model('Clinician', clinicianSchema)
module.exports = Clinician