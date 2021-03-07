let express = require('express')
let router = express.Router()
const db_config = require("../db_config.js")

const database = db_config.database

router.post('/', (req, res, next) => {
	let routes = req.body
	
	for (let route of routes) {
		let coordinates = route.geometry.coordinates
		let rating = route.properties.rating
		let note = route.properties.note
		let image = route.properties.image
		let date = route.properties.date

		let bLng = coordinates[0][0]
		let bLat = coordinates[0][1]
		let eLng = coordinates[1][0]
		let eLat = coordinates[1][1]

		let pgData = [bLng, bLat, eLng,  eLat, image, note, date, rating]
		database.none(`INSERT INTO fake_routes (blng, blat, elng,  elat, img, note, time_stamp, rating) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, pgData)
	        .then(() => console.log(`route is saved`))
	        .catch(error => console.log(error))
	}
})

module.exports = router