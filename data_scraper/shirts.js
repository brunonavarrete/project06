// modules
const machinepack = require('machinepack-http');
const http = require('http');
const cheerio = require('cheerio');
const renderer = require('./renderer');
const errors = require('./errors');

// create fileName from date
	const dateObj = new Date();
	let month = dateObj.getUTCMonth() + 1; //months from 1-12
	month = (month < 10) ? `0${month}` : month; //add 0
	let day = dateObj.getUTCDate();
	day = (day < 10) ? `0${day}` : day; //add 0
	const year = dateObj.getUTCFullYear();

	// json2csv vars
		let fields = ["Title","Price","ImageUrl","Url","Time"];
		const fileName = `${year}-${month}-${day}`;

// get information from url
	function get(){
		let myArray = [];
		machinepack.get({
			url: 'http://www.shirts4mike.com/shirts.php',
		}).exec({
			success: function(allShirtsHTML){
				// create .csv
				renderer.create( fields, fileName );
		    	// each shirt
				const $ = cheerio.load(allShirtsHTML);
				$('.products').filter(function(){
					const products = $(this);
					$(this).children().each(function(){
						let link = $(this).find('a').attr('href');
						link = `http:\/\/www.shirts4mike.com/${link}`;
						// Get each t-shirt's data
						getShirt( link );
					});
				});
			},
			// A non-2xx status code was returned from the server.
			non200Response: function (err) {
			 	const string = `${err.statusCode} - ${http.STATUS_CODES[err.statusCode]}`;
			 	errors.log(string);
			},
			// Unexpected connection error: could not send or receive HTTP request.
			requestFailed: function (err) {
				const string = `${err}`;
			 	errors.log( string );
			},
			error: function(err){
				const string = `${err}`;
				errors.log( string );
			}
		});
	}

// get individual shirt

	function getShirt( link ){
		machinepack.get({
			url: link,
		}).exec({
			success: function(eachShirtHTML){
				// Title, price, imageUrl, URL and Time
				const shirt = cheerio.load(eachShirtHTML);
				// variables
					// price (before removeing it from the h1 element)
					const shirtPrice = shirt('.shirt-details h1 span.price').text();
					// title
					let shirtTitle = shirt('.shirt-details h1 span.price').remove(); // remove span.price from h1 element
					shirtTitle = shirt('.shirt-details h1').text().replace(' ',''); // remove first blankspace
					// imgUrl
					let imgUrl = shirt('.shirt-picture span img').attr('src'); // get src
					imgUrl = `http:\/\/www.shirts4mike.com/${imgUrl}`; // create full link
					
					// final object
					const shirtData = {
						"Title": shirtTitle,
						"Price": shirtPrice,
						"ImageUrl": imgUrl,
						"Url": link,
						"Time": new Date().toString()
					};
					
					renderer.append( shirtData, fields, fileName );

					console.log(`"${shirtTitle}" added!`.blue );
			},
			// A non-2xx status code was returned from the server.
			non200Response: function (err) {
			 	const string = `${err.statusCode} - ${http.STATUS_CODES[err.statusCode]}`;
			 	errors.log(string);
			},
			// Unexpected connection error: could not send or receive HTTP request.
			requestFailed: function (err) {
				const string = `<${err}>`;
			 	errors.log( string );
			},
			error: function(err){
				const string = `<${err}>`;
				errors.log( string );
			}
		});
	}

module.exports.get = get;