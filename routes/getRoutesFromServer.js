let express = require('express')
let router = express.Router()
const fs = require("fs")
const db_config = require("../db_config.js")

const database = db_config.database
const JSONFileContent = fs.readFileSync("./public/data/RU-NIZ.osm.geojson", "utf8")

router.get('/:query', (req, res, next) => {
	const query = req.params.query
	const answer = query.split('+')[0];
	const bounds = query.split('+')[1].split('&')
	const northEastLat = bounds[0]
	const northEastLng = bounds[1]
	const southWestLat = bounds[2] 
	const southWestLng = bounds[3]

	if (answer === 'real_pedestrian' || answer === 'fake_pedestrian') {
		let tableName
		if (answer === 'real_pedestrian') tableName = 'routes'
		if (answer === 'fake_pedestrian') tableName = 'fake_routes'
		const queryToDB = `SELECT * FROM ${tableName} WHERE (blng >= ${southWestLng} AND blng <= ${northEastLng}` +
						`OR elng >= ${southWestLng} AND elng <= ${northEastLng})` +
						`AND (blat >= ${southWestLat} AND blat <= ${northEastLat}` +
						`OR elat >= ${southWestLat} AND elat <= ${northEastLat});`
		database.multi(queryToDB)
			    .then(data => {
			    	if (data[0].length != 0) {
				    	const call = JSON.stringify(data)
						res.write(call)
						res.end()
			    	} else {
			    		res.write("Null response")
						res.end()
			    	}
			    })
			    .catch(error => console.log("ERROR:", error))
	}
	if (answer === 'osm_smoothness') {
		res.write(JSONFileContent)
		res.end()
	}
})

module.exports = router