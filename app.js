//const exphbs = require('express-handlebars')
var currentTime = new Date();

// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

// configure Handlebars
app.engine('hbs', require('exphbs'));
/*app.engine('hbs', exphbs.engine({      // configure Handlebars 
    defaultlayout: 'main', 
    extname: 'hbs' 
})) */

// set Handlebars view engine
app.set('view engine', 'hbs');

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

app.use(express.static(__dirname + "/resources"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// link to our routers
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

app.use('/clinician', clinicianRouter)
app.use('/patient', patientRouter)


// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3300, () => {
    console.log('DexTrack is alive!')
})

require('./models')
