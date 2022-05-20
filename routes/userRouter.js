// libraries imported
const express = require('express')

// create our Router object
const userRouter = express.Router()

// import user controller functions
const userController = require('../controllers/userController')

// Passport Authentication middleware
const isLoggedDiabetes = (req, res, next) => {
    // If user is not logged in, redirect to About-Diabetes page
    if (!req.isAuthenticated()) {
        return res.render('aboutDiabetes', {logged: false})
    }
    // Otherwise, go to dashboard
    return next()
}

// Passport Authentication middleware
const isLoggedDextrack = (req, res, next) => {
    // If user is not logged in, redirect to About-Dextrack page
    if (!req.isAuthenticated()) {
        return res.render('aboutDextrack', {logged: false})
    }
    // Otherwise, go to dashboard
    return next()
}

userRouter.get('/about-diabetes', isLoggedDiabetes, userController.getAboutDiabetes)
userRouter.post('/about-diabetes', userController.userLogout)

userRouter.get('/about-dextrack', isLoggedDextrack, userController.getAboutDexTrack)
userRouter.post('/about-dextrack', userController.userLogout)

userRouter.get('/', userController.getIndex)

// export the router
module.exports = userRouter
