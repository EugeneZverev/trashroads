var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./trashroadsFake.db"); 

router.post('/:query', function(req, res, next) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
	let statement = db.prepare("INSERT INTO Routes VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

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
		statement.run(id, bLng, bLat, eLng, eLat, image, note, rating);
		console.log(`route ${id} is saved`)
	}
	statement.finalize();
	console.log('lalka')
});

module.exports = router;