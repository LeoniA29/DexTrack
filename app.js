const exphbs = require('express-handlebars')
var currentTime = new Date();

// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

const hbs = exphbs.create({
    defaultlayout: 'main',
    extname: 'hbs',

    // create custom helpers
    helpers: {
        isTodaysDate: x=> x.createdAt.getDate()==currentTime.getDate(),
        isGlucose: g=> g.data_type=='glucose',
        isInsulin: i=> i.data_type=='insulin',
        isWeight: w=> w.data_type=='weight',
        isSteps: s=> s.data_type=='steps'
        //selected: function(val1, val2) {
        //    return val1 == val2 ? 'selected' : '';
        //},


    }
    


});

// configure Handlebars
app.engine('hbs', hbs.engine)

// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to our router
const patientRouter = require('./routes/patientRouter')
const clinicianRouter = require('./routes/clinicianRouter')

// the demo routes are added to the end of the '/home' path
app.use('/patient', patientRouter)
app.use('/clinician', clinicianRouter)

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('DexTrack is alive!')
})

require('./models')