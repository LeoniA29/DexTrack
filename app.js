const express = require('express')
const app = express()

const flash = require('express-flash')  // for showing login error messages
const session = require('express-session')  // for managing user sessions

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: true })) // needed so that POST form works

app.use(express.static(__dirname + "/resources"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// app.use(express.static('public'))   // define where static assets like CSS live

// configure Handlebars
app.engine('hbs', require('exphbs'));

// set Handlebars view engine
app.set('view engine', 'hbs');

app.use(flash())

app.use(
    session({
    // The secret used to sign session cookies (ADD ENV VAR)
    secret: process.env.SESSION_SECRET || 'INFO30005',
    name: 'info30005', // The cookie name (CHANGE THIS)
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: 'strict',
        httpOnly: true,
        secure: app.get('env') === 'production'
    },
    })
)


if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('DexTrack is alive!')
})

// use PASSPORT
const passport = require('./passport')
app.use(passport.authenticate('session'))

// link to our routers
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')
const userRouter = require('./routes/userRouter')

app.use('/clinician', clinicianRouter)
app.use('/patient', patientRouter)
app.use('/', userRouter)

require('./models')
