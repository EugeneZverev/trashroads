let express = require('express');
let router = express.Router();
const db_config = require("../db_config.js");

const database = db_config.database;

router.post('/:query', function(req, res, next) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});

	let receivedObjectsArray = req.params.query;
	let receivedJSONObjectsArray = JSON.parse(receivedObjectsArray);
	for(var route in receivedJSONObjectsArray){
		let currentRoute = receivedJSONObjectsArray[route];
		
		let id = receivedJSONObjectsArray[route].id;
		let coordinates = receivedJSONObjectsArray[route].geometry.coordinates;
		let rating = receivedJSONObjectsArray[route].properties.rating;
		let note = receivedJSONObjectsArray[route].properties.note;
		let image = receivedJSONObjectsArray[route].properties.image;
		let date = receivedJSONObjectsArray[route].properties.date;

		let bLng = coordinates[0][0];
		let bLat = coordinates[0][1];
		let eLng = coordinates[1][0];
		let eLat = coordinates[1][1];
		let pgData = [bLng, bLat, eLng,  eLat, image, note, date, rating];
	    database.none(`INSERT INTO fake_routes (blng, blat, elng,  elat, img, note, time_stamp, rating) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, pgData)
	        .then(() => {
	            console.log(`route ${id} is saved`);
	        })
	        .catch(error => {
	            console.log(error);
	        });
	}
});

module.exports = router;