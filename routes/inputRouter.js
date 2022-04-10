// add our router
const express = require('express')
const inputRouter = express.Router()

// express-validator, to validate user data in forms
const expressValidator = require('express-validator')

// connect to controller
const inputController = require('../controllers/inputController.js')

// process routes by calling controller functions
inputRouter.get('/', (req, res) => foodController.getAllFoods(req, res))
inputRouter.get('/foods/:id', (req, res) => foodController.getOneFood(req, res))
inputRouter.post('/search', expressValidator.body('foodName').isAlpha().optional({checkFalsy: true}), (req, res) => foodController.searchFoods(req, res))  // includes validation of user input

// export the router
module.exports = foodRouter
