const exphbs = require('express-handlebars')

// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

<<<<<<< HEAD
<<<<<<< HEAD
const hbs = exphbs.create({
    defaultlayout: 'main',
    extname: 'hbs',

    // create custom helpers
    helpers: {
        //selected: function(val1, val2) {
        //    return val1 == val2 ? 'selected' : '';
        //},


    }
    



});

// configure Handlebars
app.engine('hbs', hbs.engine)

=======
// configure Handlebars
=======
// configure Handlebars
>>>>>>> parent of 80d8163 (update patient schema and register patient function)
app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout: 'main',
        extname: 'hbs',
    })
)
<<<<<<< HEAD
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
=======
>>>>>>> parent of 80d8163 (update patient schema and register patient function)
// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to our router
<<<<<<< HEAD
const patientRouter = require('./routes/patientRouter')
<<<<<<< HEAD
const clinicianRouter = require('./routes/clinicianRouter')

// the demo routes are added to the end of the '/home' path
app.use('/home/patient', patientRouter)
app.use('/home/clinician', clinicianRouter)
=======

// the demo routes are added to the end of the '/people' path
app.use('/patient', patientRouter)
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
=======
const inputRouter = require('./routes/inputRouter')

// the demo routes are added to the end of the '/home' path
app.use('/home', inputRouter)
>>>>>>> parent of 80d8163 (update patient schema and register patient function)

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
<<<<<<< HEAD
    console.log('DexTrack is alive!')
})

require('./models')
=======
    console.log('The DexTrack app is running!')
})

require('./models')
>>>>>>> ecfd7a40401f8f5a7bc3089d6a57c439b6ea339c
