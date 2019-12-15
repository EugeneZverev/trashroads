var express = require('express');
var router = express.Router();

var pgp = require("pg-promise")();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'trashroads',
    user: 'admin',
    password: 'password'
};
const db = pgp(cn);

router.post('/:query', function(req, res, next) {
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
	        console.log(data[0].length);
	    })
	    .catch(function (error) {
	        console.log("ERROR:", error);
	    });
})

module.exports = router;