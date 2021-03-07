export const mainTile = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZXVnZW5lLXoiLCJhIjoiY2trendsaWxtMGZsZjJvbGIyeDBrdTE2ZiJ9.7nzaTORqoc2D5uVT07NQ7w'
})
export const darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
})

export function getGeoJSONLine(id, bLng, bLat, eLng, eLat, image, note, date, rating) {
	return {
            	'type': 'Feature',
            	'geometry': {
                	'type': 'LineString',
                	'coordinates': [
                	    [bLng, bLat],
                	    [eLng, eLat]
                	]
            	},
            	'properties': {
            	    note,
            	    rating,
                	image,
                	date
            	},
            	id
        	}
}

export function getLineStyle(rating) {
	let color = ""
	if (rating === 1) color = "#cc0000"
	else if (rating === 2) color = "#ff7800"
	else if (rating === 3) color = "#ffcc00"
	else if (rating === 4) color = "#53ff1a"

	return {
                color,
                weight: 3,
                opacity: 1
            }
}

function getURLFromLatLngBounds(bounds) {
    const northEastLat = bounds.getNorthEast().lat
    const northEastLng = bounds.getNorthEast().lng
    const southWestLat = bounds.getSouthWest().lat
    const southWestLng = bounds.getSouthWest().lng

    return `${northEastLat}&${northEastLng}&${southWestLat}&${southWestLng}`
}

export async function getAndDrawRealRoutes(layerName, workingLayer, windowBounds) {
    const response = await fetch(`/db/get_routes/${layerName}+${getURLFromLatLngBounds(windowBounds)}`)

    if (response.ok) { 
        const routes = await response.json()

        if (routes !== "Null response") {
            if (layerName === 'real_pedestrian' || layerName === 'fake_pedestrian') {
                for (let route of routes[0]) {
                    const currentRoute = getGeoJSONLine(
                        route.route_id, 
                        route.blng, 
                        route.blat, 
                        route.elng, 
                        route.elat, 
                        route.img, 
                        route.note, 
                        route.time_stamp, 
                        route.rating
                    )
                    workingLayer.addData(currentRoute)
                }
                console.log(`The number of ${layerName} objects within the browser window:`, routes[0].length)
                workingLayer.eachLayer(layer => layer.setStyle(getLineStyle(layer.feature.properties.rating)))
            }   

            if (layerName === 'osm_smoothness') {
                const OSMStyles = {
                    'excellent': 4,
                    'good': 4,
                    'intermediate': 3,
                    'bad': 2,
                    'very_bad': 2,
                    'horrible': 1,
                    'very_horrible': 1,
                    'impassable': 1
                }

                workingLayer.addData(routes)
                workingLayer.eachLayer(layer => {  
                    const smoothness = layer.feature.properties.smoothness
                    layer.setStyle(getLineStyle(OSMStyles[smoothness]))
                })
            }
        }
    } else console.log("Ошибка HTTP: " + response.status)    
}