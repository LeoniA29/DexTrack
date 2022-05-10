// set up Passport

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {Patient} = require('./models/patient')
const Clinician = require('./models/clinician')

passport.serializeUser((user, done) => {
    done(undefined, user._id)
    })

passport.deserializeUser( async function (userId, done)  {

    let user = await Clinician.findById(userId, { password: 0 })
    
    if (user) {
        return done(undefined, user)
    }
    else {
        user = await Patient.findById(userId, { password: 0 })
        return done(undefined, user)
    }
})

// Updated LocalStrategy function
let localStrategy = new LocalStrategy(
    async function(username, password, done) {
        let user;

        user = await Clinician.findOne({ "username": username})
        if (!user){
            user = await Patient.findOne({ "username": username})

            if (!user){
                return done(undefined, false, {message: 'Incorrect username or password',})
            }
            console.log("a patient")
            user.verifyPassword(password, (err, valid) => {
                console.log(password)
                console.log(err)
                console.log(valid)
                if (err) {
                    return done(undefined, false, {message: 'Unknown error has occurred'})
                }

                if (!valid) {
                    return done(undefined, false, {message: 'Incorrect username or password',})
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        }

        else {
            console.log("a clinician")
            user.verifyPassword(password, (err, valid) => {
                console.log(password)
                console.log(err)
                console.log(valid)
                if (err) {
                    
                    return done(undefined, false, {message: 'Unknown error has occurred'})
                }

                if (!valid) {
                    return done(undefined, false, {message: 'Incorrect username or password',})
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        }




        /*
        Patient.findOne({ username }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {message: 'Unknown error has occurred'})
            }

            if (!user) {
                return done(undefined, false, {message: 'Incorrect username or password',})
            }
            // Check password
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {message: 'Unknown error has occurred'})
                }

                if (!valid) {
                    return done(undefined, false, {message: 'Incorrect username or password',})
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
        */
    })

passport.use(localStrategy)
module.exports = passport