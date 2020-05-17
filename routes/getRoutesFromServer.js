let express = require('express');
let router = express.Router();
const fs = require("fs");
const db_config = require("../db_config.js");

const database = db_config.database;
let JSONFileContent = fs.readFileSync("./public/data/RU-NIZ.osm.geojson", "utf8");

router.post('/:query', function(req, res, next) {
	let query = req.params.query;
	let answer = query.split('+')[0];
	let bounds = query.split('+')[1].split('&');
	let	northEastLat = bounds[0], northEastLng = bounds[1],
		southWestLat = bounds[2], southWestLng = bounds[3];
	if(answer==='real_pedestrian' || answer==='fake_pedestrian'){
		let tableName = '';
		if(answer==='real_pedestrian') tableName = 'routes';
		if(answer==='fake_pedestrian') tableName = 'fake_routes';
		res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
		database.multi(`SELECT * FROM ${tableName}`)
		    .then(function (data) {
			    let call = JSON.stringify(data);
				res.write(call);
				res.end();
		    })
		    .catch(function (error) {
		        console.log("ERROR:", error);
		    });
	}
	if(answer==='osm_smoothness'){
		res.write(JSONFileContent);
		res.end();
	}
});

module.exports = router;

		/*database.multi(`SELECT * FROM ${tableName} WHERE (blng >= ${southWestLng} AND blng <= ${northEastLng}` +
					   `OR elng >= ${southWestLng} AND elng <= ${northEastLng})` +
				  	   `AND (blat >= ${southWestLat} AND blat <= ${northEastLat}` +
				 	   `OR elat >= ${southWestLat} AND elat <= ${northEastLat});`)
		    .then(function (data) {
		    	if(data[0].length != 0){
			    	let call = JSON.stringify(data);
					res.write(call);
					res.end();
		    	}
		    })
		    .catch(function (error) {
		        console.log("ERROR:", error);
		    });*/