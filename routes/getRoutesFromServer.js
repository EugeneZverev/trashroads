let express = require('express');
let router = express.Router();
const fs = require("fs");
const db_config = require("../db_config.js");

const database = db_config.database;
let JSONFileContent = fs.readFileSync("./public/data/RU-NIZ.osm.geojson", "utf8");

router.post('/:query', function(req, res, next) {
	let answer = req.params.query;
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

/*router.post('/:query', function(req, res, next) {
	console.log("request:" + req.params);
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
	let rect = req.params.query.split('&');
	let	northEastLat = rect[0],
		northEastLng = rect[1],
		southWestLat = rect[2],
		southWestLng = rect[3];
	db.multi(`SELECT route FROM routes WHERE (CAST(route->'geometry'->'coordinates'->0->>0 AS DOUBLE PRECISION) >= ${southWestLng}` +
			 `AND CAST(route->'geometry'->'coordinates'->0->>0 AS DOUBLE PRECISION) <= ${northEastLng}` +
			 `OR CAST(route->'geometry'->'coordinates'->1->>0 AS DOUBLE PRECISION) >= ${southWestLng}` +
			 `AND CAST(route->'geometry'->'coordinates'->1->>0 AS DOUBLE PRECISION) <= ${northEastLng})` +
			 `AND (CAST(route->'geometry'->'coordinates'->0->>1 AS DOUBLE PRECISION) >= ${southWestLat}` +
			 `AND CAST(route->'geometry'->'coordinates'->0->>1 AS DOUBLE PRECISION) <= ${northEastLat}` +
			 `OR CAST(route->'geometry'->'coordinates'->1->>1 AS DOUBLE PRECISION) >= ${southWestLat}` +
			 `AND CAST(route->'geometry'->'coordinates'->1->>1 AS DOUBLE PRECISION) <= ${northEastLat});`)
	    .then(function (data) {
	    	if(data[0].length!=0) {
	    		let call = JSON.stringify(data);
				res.write(call);
				res.end();
	    	}
	        //console.log(data[0].length);
	    })
	    .catch(function (error) {
	        console.log("ERROR:", error);
	    });
})*/