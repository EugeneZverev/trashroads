const fs = require("fs");
let express = require('express');
let router = express.Router();

let JSONFileContent = fs.readFileSync("./public/data/RU-NIZ.osm.geojson", "utf8");

router.post('/', function(req, res, next) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
	res.write(JSONFileContent);
	res.end();
});

module.exports = router;