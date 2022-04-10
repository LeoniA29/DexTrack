// connect to Mongoose model
const mongoose = require('mongoose')
const Food = mongoose.model('Food')

// get express-validator, to validate user data in forms
const expressValidator = require('express-validator')

const getAllFoods = async (req, res) => { // get list of foods, and render it
	try {
		const foods = await Food.find( {}, {name:true, photo:true}).lean()	// we only need names and photos
		res.render('index', {"foods": foods})	
	} catch (err) {
		console.log(err)
	}
}

const getOneFood =  async (req, res) => { // get one food, and render it
	try {
		const food = await Food.findOne( {_id: req.params.id} ).lean()
		res.render('showFood', {"thisfood": food})	
	} catch (err) {
		console.log(err)
	}
}

const searchFoods = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	if (req.body.foodName !== '') {
		query["name"] = {$regex: new RegExp(req.body.foodName, 'i') }
	}
	if (req.body.vegan) {
		query["vegan"] = true
	}
	if (req.body.organic) {
		query["organic"] = true
	}
	// the query has been constructed - now execute against the database
	try {
		const foods = await Food.find(query, {name:true, photo:true}).lean()
		res.render('index', {"foods": foods})	
	} catch (err) {
		console.log(err)
	}
}


// two unused routes
const showFilter = (req, res) => { // show filter page - currently unused
	res.render('showFilter')
}

const processFilter = (req, res) => { // receives POST data - user's food filter  - currently unused
	res.render('filterPost', {
		filterData: JSON.stringify(req.body)
	})
}


// export the controller functions
module.exports = {getAllFoods, getOneFood, searchFoods, showFilter, processFilter}