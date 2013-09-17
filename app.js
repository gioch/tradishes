
/**
 * Module dependencies.
 */

var express = require('express');
var stylus  = require('stylus');
var nib = require('nib');

var app = express();

function compile(str, path) {
	return stylus(str)
					.set('filename',path)
					.use(nib());
}

app.set('views', __dirname + ('/views'));
app.set('view engine', 'jade');
app.set(express.logger('dev'));
app.use(express.bodyParser());
app.use(stylus.middleware( {
	src: __dirname + '/public',
	compile: compile
}));

app.use(express.static(__dirname + '/public'));

var countries = [{name: 'Georgia'},
				 {name: 'USA'},
				 {name: 'England'},
				 {name: 'Brasil'}];

var categories = [{name: 'Hot Dishes'},
				  {name: 'Cold Dishes'},
				  {name: 'Deserts'},
				  {name: 'Salts'}];

var types = [{name: 'Vegetarian'},
			 {name: 'Not Vegetarian'},
			 {name: 'All'}];

var dishes = [ {name: "Grill",       country: 1, category: 0, type:0, time: 30, img: 'http://www.womansday.com/cm/womansday/images/Uy/09-Chicken-Cordon-Deux-1.jpg'},
	           {name: "Khinkali",    country: 0, category: 1, type:1, time: 41, img: 'http://thedishblog.com/wp-content/uploads/2011/01/istock_stickyorangechicken.jpg'}, 
	           {name: "Chashushuli", country: 0, category: 0, type:0, time: 62, img: 'http://j-sainsbury.co.uk/media/440271/chinese-prawn-stir-fry.jpg'},  
	           {name: "Satsivi",     country: 2, category: 1, type:1, time: 23, img: 'http://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/eating_out_slideshow/getty_rr_photo_of_chinese_stir_fry.jpg'},
	           {name: "Ajamsandali", country: 3, category: 3, type:1, time: 25, img: 'http://t0.gstatic.com/images?q=tbn:ANd9GcScGPmR6LOycYLL-dUEDx2vvSzPQ6j7XXj_PeIOBXyCtim8ycK6qA'}]; 


var favs = [];

app.get('/', function (req, res) {  

	res.render('index', { countries: countries, categories: categories, 
						  types: types, dishes: dishes} );
});

app.get('/recipes/:recipeId', function (req, res) {

	var dish = dishes[req.params.recipeId];

	res.render('details', { countries: countries, categories: categories, 
						    types: types, dish: dish, index: req.params.recipeId});
});

app.get('/add', function (req, res) {
	res.render('addRecipe', { countries: countries, categories: categories, 
						      types: types, dishes: dishes});
});

app.get('/addToFavs/:recipeId', function (req, res) {

	favs.push(req.params.recipeId);

    res.render('favs', { countries: countries, categories: categories, 
						  types: types, favs: favs, dishes: dishes});

});


app.get('/favs', function (req, res) {

    res.render('favs', { countries: countries, categories: categories, 
						  types: types, dishes: favs});

});

app.post('/save', function (req, res) {

	dishes.push( { name: req.body.name, country: req.body.country, category: req.body.category,
	               type: req.body.type, time: req.body.time, img: req.body.img } );

	res.render('index', { countries: countries, categories: categories, 
						  types: types, dishes: dishes});
});

app.post('/detailedSearch', function (req, res) {

	var country  = req.body.country;
	var category = req.body.category;
    var type     = req.body.type;

    var foundDishes = [];

    for (var i = 0; i < dishes.length; i++) {

    	if( dishes[i].country == country && dishes[i].category == category && dishes[i].type == type) {
    		foundDishes.push( dishes[i] );
    	}
    };

    res.render('index', { countries: countries, categories: categories, 
						  types: types, dishes: foundDishes});

});


app.listen(3000);