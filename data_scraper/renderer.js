const json2csv = require('json2csv');
const fs = require('fs');
const colors = require('colors');
const errors = require('./errors');

// appendToCsv
	function append( appendThis, fields, fileName ){	
        var toCsv = {
		    data: appendThis,
		    fields: fields,
		    hasCSVColumnTitle: false
		};

        //write the actual data and end with newline
        var csv = json2csv(toCsv) + "\r\n";

        fs.appendFile(`./data/${fileName}.csv`, csv, function (err) {
            if (err) {
            	const string = `${err}`;
			 	errors.log( string );
			}
        }); 
	}

// create csv
	function create( fields, fileName ){
		//write the headers and newline
		fs.stat(`./data/${fileName}.csv`, function (err, stat) {
			if (err == null) {
		        fs.unlink(`./data/${fileName}.csv`);
		        console.log('Deleting previous file...\n','Deleted.'.bgBlack.green);
		    }

	    	console.log('Writing headers...');

	    	fields = (fields + "\r\n");

	    	fs.writeFile(`./data/${fileName}.csv`, fields, function (err, stat) {
	    	    if (err) {
	            	const string = `${err}`;
				 	errors.log( string );
				}
	    	    console.log('Headers created.'.bgBlack.green,'\nWriting shirt data...');
	    	});
	    });
	}

module.exports.create = create;
module.exports.append = append;