// Set Up Passport Authentication
const passport = require('passport')

// Use Passport's Local Strategy
const LocalStrategy = require('passport-local').Strategy

// Import Patient and Clinician models
const {Patient} = require('./models/patient')
const Clinician = require('./models/clinician')


// Function to serialize current user
passport.serializeUser((user, done) => {
    done(undefined, user._id)
})

// Function to deserialize current user
passport.deserializeUser( async function (userId, done)  {

    var user = await Clinician.findById(userId, { password: 0 })

    if (user) {
        // user is a clinincian
        return done(undefined, user)
    } else {
        // user is a patient
        user = await Patient.findById(userId, { password: 0 })
        return done(undefined, user)
    }
})

// LocalStrategy function to work on both Patients and Clinicians
let localStrategy = new LocalStrategy(
    async function(username, password, done) {
        
        var user = await Patient.findOne({ email: username})
      
        if (!user){
            // user not a patient, but might be a clinician
            user = await Clinician.findOne({ email: username})

            if (!user){
                // user neither a patient nor clinician
                return done(undefined, false, {message: 'Incorrect email or password',})
            }
            
            // user is a clinician
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {message: 'Unknown error has occurred'})
                }

                if (!valid) {
                    return done(undefined, false, {message: 'Incorrect email or password',})
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        }

        else {
            // user is a patient
            user.verifyPassword(password, (err, valid) => {
                
                if (err) {
                    
                    return done(undefined, false, {message: 'Unknown error has occurred'})
                }

                if (!valid) {
                    return done(undefined, false, {message: 'Incorrect email or password',})
                }

                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        }
    })

// Passport uses "Updated" Local Strategy
passport.use(localStrategy)

// Export passpot module
module.exports = passport