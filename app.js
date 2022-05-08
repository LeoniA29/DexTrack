const express = require('express')
const app = express()
const flash = require('express-flash')  // for showing login error messages
const session = require('express-session')  // for managing user sessions
app.use(flash())

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: true })) // needed so that POST form works

app.use(express.static(__dirname + "/resources"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
// app.use(express.static('public'))   // define where static assets like CSS live

// configure Handlebars
app.engine('hbs', require('exphbs'));
/*app.engine('hbs', exphbs.engine({      // configure Handlebars 
    defaultlayout: 'main', 
    extname: 'hbs' 
})) */

// set Handlebars view engine
app.set('view engine', 'hbs');

app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 300000 // sessions expire after 5 minutes
        },
    })
)

// use PASSPORT
const passport = require('./passport')
// use EXPRESS-VALIDATOR (not actually used at this stage)
const { body, validationResult } = require('express-validator')
app.use(passport.authenticate('session'))

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
app.listen(process.env.PORT || 3000, () => {
    console.log('DexTrack is alive!')
})

require('./models')
