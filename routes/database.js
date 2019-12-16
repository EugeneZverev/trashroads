var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./trashroadsFake.db"); 

router.post('/', function(req, res, next) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
	db.all("SELECT * FROM Routes", function(err, rows){
		if(err)
		{
			console.log("ERROR");
		}
		else
		{
			var call = JSON.stringify(rows)
			res.write(call)
			res.end();
		}
	});
});

module.exports = router;