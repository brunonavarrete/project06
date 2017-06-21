const fs = require('fs');
const colors = require('colors');
const path = `./scrapper-error.log`;
const dateString = new Date().toString(); //error handling

// append error
	function append( string ) {
		fs.appendFile(path, `\r\n[${dateString}] <${string}>`, function () {
            console.log('ERROR'.red.bgBlack,string);
        });
	}
// create log
	function log( string ){
		fs.stat(path, function (err, stat) {
		    if (err == null) {
		    	//append
		    	append(string);
		    } else {
		    	//create and append
		    	fs.writeFile(path, `[${dateString}] <${string}>`, function () {
		    	    console.log('ERROR'.red.bgBlack,string);
		    	});
		    }
		});
	}

module.exports.log = log;
module.exports.append = append;