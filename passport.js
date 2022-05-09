// set up Passport

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {Patient, Data, DataSet, Threshold} = require('../DexTrack/models/patient')

passport.serializeUser((user, done) => {
    done(undefined, user._id)
    })

passport.deserializeUser((userId, done) => {
    Patient.findById(userId, { password: 0 }, (err, user) => {
    if (err) {
    return done(err, undefined)
    }
    return done(undefined, user)
    })
    })

// Updated LocalStrategy function
passport.use(
    new LocalStrategy((username, password, done) => {
    Patient.findOne({ username }, {}, {}, (err, user) => {
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
    return done(undefined, false, {message: 'Unknown error has occurred'
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

module.exports = passport