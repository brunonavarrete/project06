const fs = require('fs');
const shirts = require('./shirts');


// check if ./data exists
if (fs.existsSync('./data')) {
    shirts.get();
} else {
	console.log('Creating ./data directory');
	fs.mkdir('./data',() => {
		shirts.get();
	});
}
