const mongoose = require('mongoose')

// schema for notes
const note = new mongoose.Schema({
   note_content: String,
   note_date: Date
});

// schema for threshold
const threshold = new mongoose.Schema({
<<<<<<< HEAD
   low: {
      type: Number,
      default: null
   },
   high: {
      type: Number,
      default: null
   },
   th_required: {
      type: Boolean,
      default: false
   },
=======
   low: Number,
   high: Number,
   required: Boolean,
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
   type: {
      type: String,
      enum: ['glucose', 'insulin', 'weight', 'steps']
   }
});

// schema for data 
const data = new mongoose.Schema({
<<<<<<< HEAD
   data_entry: Number,
   data_comment: String,
   data_type: String,
   data_hex: String
=======
   data_entry: String,
   data_comment: String,
   data_type: String
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
});


// schema for data set
const data_set = new mongoose.Schema({
   set_date: Date,
   // created_date :{type: Date, default: Date.now},
   glucose_data: { 
      type: data, 
      default: null
   },
   steps_data: { 
      type: data, 
      default: null
   },
   weight_data: { 
      type: data, 
      default: null
   },
   insulin_data: { 
      type: data, 
      default: null
   }
});

// schema for patient
// patient collection 
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
   input_data: [data_set]
  })


const Patient = mongoose.model('Patient', schema)
const Data = mongoose.model('Data', data)
const DataSet = mongoose.model('DataSet', data_set)
<<<<<<< HEAD
const Threshold = mongoose.model('Threshold', threshold)

module.exports = {Patient, Data, DataSet, Threshold}
=======

module.exports = {Patient, Data, DataSet}
>>>>>>> cebbb5b0219b80493d2f1fa9c1eb71816d00c003
