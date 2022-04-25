const exphbs = require('express-handlebars')
// var currentTime = new Date();
// console.log(currentTime.getDate())

// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout: 'main',
        extname: 'hbs',
        helpers: {
            isTodaysDate: function(x) {
                // console.log(x.createdAt.getDate())
                var currentTime = new Date();
                return (x.createdAt.getDate()==currentTime.getDate())
            },
            isGlucose: g=> g.data_type=='glucose',
            isInsulin: i=> i.data_type=='insulin',
            isWeight: w=> w.data_type=='weight',
            isSteps: s=> s.data_type=='steps'
        }
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

app.use(express.static(__dirname + "/resources"));

// link to our routers
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

app.use('/home/clinician', clinicianRouter)
app.use('/home/patient', patientRouter)

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('DexTrack is alive!')
})

require('./models')
