// set up Passport

const passport = require('passport')
const LocalStrategy = require('passport-local')
const Clinician = require('./models/clinician')
const {Patient, Data, DataSet, Threshold} = require('./models/patient')

// Updated serialize/deserialize functions
passport.serializeUser((user, done) => {
    done(undefined, user._id)
})

passport.deserializeUser((userId, done) => {
    Clinician.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

// Set up "local" strategy, i.e. authentication based on username/password. There are other types of strategy too.
// Define local authentication strategy for Passport
// http://www.passportjs.org/docs/downloads/html/#strategies
passport.use(
    new LocalStrategy((username, password, done) => {
        Clinician.findOne({ username }, {}, {}, (err, user) => { 
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect username or password',
                })
            }
            // Check password
            user.verifyPassword(password, (err, valid) => { 
                if (err) {
                    return done(undefined, false, { 
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect username or password',
                    })
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user) 
            })
        }) 
    })
)

/*Clinician.find({}, (err, clinicians) => {
    if (clinicians.length >= 2) return;
    Clinician.create({ username: 'user', password: 'yeah!', first_name: 'Nalia', last_name: 'King'}, (err) => {
        if (err) { console.log(err); return; }
        console.log('Dummy user inserted')
    })
})*/

module.exports = passport