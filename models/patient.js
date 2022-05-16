const mongoose = require('mongoose') // import mongoose 
const bcrypt = require('bcryptjs') // import bcrypt

// schema for notes
const clinician_note = new mongoose.Schema({
   note_content: {type: String, default: " ", required: true},
   note_date: {type: Date, default: new Date(), requried: true}
});

// schema for threshold
const threshold = new mongoose.Schema({
   low: {type: Number, default: null}, // lower threshold
   high: {type: Number, default: null}, // upper threshold
   th_required: {type: Boolean, default: true}, // required set by clinician 
   type: {type: String, enum: ['glucose', 'insulin', 'weight', 'steps']} // type of data entry
});

// schema for data 
const data = new mongoose.Schema({
   data_entry: {type: Number, required: true},
   data_comment: String,
   data_type: {type: String, required: true},
   data_hex: String,
   data_date: {type: Date, required: true}
});

// schema for data set
const data_set = new mongoose.Schema({
   set_date: {type: Date, required: true},
   glucose_data: {type: data, default: null},
   steps_data: { type: data, default: null},
   weight_data: { type: data, default: null},
   insulin_data: { type: data, default: null}
});

// schema for patient patient collection 
const patientSchema = new mongoose.Schema({
   first_name: {type: String, required: true},
   last_name: {type: String, required: true},
   username: {type: String, unique: true, required: true},
   screen_name: {type: String, unique: true, required: true},
   password: {type: String, required: true}, 
   secret: {type: String, default: 'INFO30005'},
   score: {type: Number, default: 0},
   role: {type: String, default: 'patient', required: true},
   email: {type: String, required: true},
   sex: { type: String, enum: ['Female','Male','Prefer not to answer'], default: 'Prefer not to answer'},
   dob: {type: Date, required: true},
   phone: {type: String, required: true},
   occupation: {type: String, required: true},
   address: {type: String, required: true},
   postcode: {type: String, required: true},
   short_bio: {type: String, default: "Tell us a bit about yourself!"},

   clinician_message: clinician_note,// this is unique from the clinician to each patient
   threshold_list: [threshold], // array of thresholds objects
   input_data: [data_set] // array of data_set objects
  })


// password comparison function
patientSchema.methods.verifyPassword = function (password, callback) {
   bcrypt.compare(password, this.password, (err, valid) => {
       callback(err, valid)
   })
}

const SALT_FACTOR = 10
// hash password before saving
patientSchema.pre('save', function save(next) {
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

const Data = mongoose.model('Data', data)
const DataSet = mongoose.model('DataSet', data_set)
const Threshold = mongoose.model('Threshold', threshold)
const Patient = mongoose.model('Patient', patientSchema)
const Clinician_Note = mongoose.model('Clinician_Note', clinician_note)

module.exports = {Patient, DataSet, Data, Threshold, Clinician_Note}
