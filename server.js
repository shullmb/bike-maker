const express = require('express');
const layouts = require('express-ejs-layouts');
const request = require('request');
const methodOverride = require('method-override');
const db = require('./models');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
	res.render('index');
})

// GET ALL
app.get('/bikes', function(req, res) {
	db.bike.findAll().then( function(bikes) {
		res.render('bikes/index', {bikes})
	})
})

app.get('/bikes/new', function(req, res) {
	// request hit bikeindex
		let uri = 'https://bikeindex.org:443/api/v3/manufacturers?page=1&per_page=10'
		request(uri, function(err, response, body) {
			let manufacturers = JSON.parse(body).manufacturers
			res.render('bikes/new', {manufacturers: manufacturers})
		})
})

// GET ONE
app.get('/bikes/:id', function(req, res) {
	db.bike.findById(req.params.id).then( function(bike) {
		res.render('bikes/show', {bike})
	})
})

// GET EDIT FORM
app.get('/bikes/:id/edit', function(req, res) {
	let uri = 'https://bikeindex.org:443/api/v3/manufacturers?page=1&per_page=10'
	request(uri, function (err, response, body) {
		let manufacturers = JSON.parse(body).manufacturers
		db.bike.findById(req.params.id).then( function(bike) {
			res.render('bikes/edit', {bike:bike, manufacturers:manufacturers})
		})
	})
})

// CREATE ONE
app.post('/bikes', function(req, res) {
	db.bike.create({
		manufacturer: req.body.manufacturer,
		year: req.body.year,
		model: req.body.model,
		size: req.body.size
	}).then( function() {
		res.redirect('/bikes')
	})
})

// UPDATE ONE
app.put('/bikes/:id', function(req, res) {
	db.bike.update({
		manufacturer: req.body.manufacturer,
		year: req.body.year,
		model: req.body.model,
		size: req.body.size
	},{ where: {id: req.params.id}}).then( function() {
		res.redirect('/bikes/' + req.params.id)
	})
})

// DESTROY ONE
app.delete('/bikes/:id', function(req, res) {
	db.bike.destroy({
		where: {id: req.params.id}
	}).then( function() {
		res.redirect('/bikes')
	})
})

app.listen(port, function() {
	console.log('🔥You are spinning on ' + port);
})
