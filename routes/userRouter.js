const express = require('express')

// create our Router object
const userRouter = express.Router()

// import patient controller functions
const userController = require('../controllers/userController')

// Passport Authentication middleware
const isLoggedIn1 = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.render('aboutDiabetes', {logged: false})
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Passport Authentication middleware
const isLoggedIn2 = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.render('aboutDexTrack', {logged: false})
    }
    // Otherwise, proceed to next middleware function
    return next()
}

userRouter.get('/about-diabetes', isLoggedIn1, userController.getAboutDiabetes)
userRouter.get('/about-dextrack', isLoggedIn2, userController.getAboutDexTrack)

userRouter.post('/about-diabetes', userController.userLogout)
userRouter.post('/about-dextrack', userController.userLogout)

userRouter.get('/', userController.getIndex)

// export the router
module.exports = userRouter
