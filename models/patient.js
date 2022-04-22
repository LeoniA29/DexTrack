const mongoose = require('mongoose')

// schema for notes
const note = new mongoose.Schema({
   note_content: String,
   note_date: Date
});

// schema for threshold
const threshold = new mongoose.Schema({
   low: Number,
   high: Number,
   required: Boolean,
   type: {
      type: String,
      enum: ['glucose', 'insulin', 'weight', 'steps']
   }
});

// schema for data input
const data = new mongoose.Schema({
   data_entry: Number,
   data_comment: String,
   data_date: Date,
   data_type: {
      type: String,
      enum: ['glucose', 'insulin', 'weight', 'steps']
   }
});

const schema = new mongoose.Schema({
 first_name: String,
 last_name: String,
 email: String,
 sex: {
    type: String,
    enum: ['Female','Male','Prefer not to answer'],
    default: 'Prefer not to answer'
 },
 dob: Date,
 phone: String,
 occupation: String,
 address: String,
 postcode: String,
 // this is unique from the clinician to each patient
 clinician_message: String,
  // array of objects for the patient defined in the schema below
 clincian_notes: [note],
 threshold_list: [threshold],
 // input_data: [data],
 input_data: [{ entry: String, comment: String, createdAt:{type: Date, default: Date.now}}]
})

const Patient = mongoose.model('Patient', schema)

module.exports = Patient