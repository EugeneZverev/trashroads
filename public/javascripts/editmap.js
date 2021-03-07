import {getGeoJSONLine, getLineStyle, getAndDrawRealRoutes} from './generalObjects.js'
import {mainTile, darkTheme} from './generalObjects.js'

async function sendEditedDataToPG(data) {
	const responseOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}
	const response = await fetch('/db/send_routes/', responseOptions)
	if (!response.ok) console.log(`Error:\t${response.status}`) 
}

const mapCenter = [56.326827, 44.018]
const mapScale = 16
const map = L.map('mapid', {zoomControl: false}).setView(mapCenter, mapScale)
darkTheme.addTo(map)

map.pm.addControls({
  	position: 'topleft',
  	drawMarker: false,
  	drawCircleMarker: false,
  	drawRectangle: false,
  	drawPolygon: false,
  	drawMarker: false,
  	drawCircle: false,
  	cutPolygon: false,
  	removalMode: false
})

const routesRealPedestrianLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map)	
let routesFakePGLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map)			

const windowBounds = map.getBounds()

const basemapControl = {
	"Карта улиц": mainTile,
	"Тёмная карта": darkTheme  
}
const layerControl = {
	"Реальные пешеходные данные": routesRealPedestrianLayer,
	"Фэйковые пешеходные данные": routesFakePGLayer
}
const layersController = L.control.layers(basemapControl, layerControl).addTo(map)

getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBounds)
getAndDrawRealRoutes('real_pedestrian', routesRealPedestrianLayer, windowBounds)

let currentLayersList = [], checkedLayersList = []

map.on('pm:create', e => {
	const currentCreatedLayer = e.layer
	currentLayersList.push(currentCreatedLayer)
	currentCreatedLayer.on('click', e => {
		const rating = +prompt('УКАЖИТЕ СОСТОЯНИЕ УЧАСТКА(ОТ 1 - ОЧЕНЬ ПЛОХО, ДО 4 - ОТЛИЧНО', '')
		const catchedLayer = e.target
		const currentCoordinatesArray = catchedLayer._latlngs
		const newLayer = L.geoJSON().addTo(map)
		
		if (rating == 1 || rating == 2 || rating == 3 || rating == 4) {
			for (let point = 0; point < currentCoordinatesArray.length - 1; point++) {
				const bLng = currentCoordinatesArray[point].lng
				const bLat = currentCoordinatesArray[point].lat
				const eLng = currentCoordinatesArray[point + 1].lng
				const eLat = currentCoordinatesArray[point + 1].lat
				const now = new Date()
				const currentRoute = getGeoJSONLine(null, bLng, bLat, eLng, eLat, null, null, now, rating)
				newLayer.addData(currentRoute)
			}
			
			newLayer.eachLayer(layer => {  
				layer.setStyle(getLineStyle(layer.feature.properties.rating))
				checkedLayersList.push(layer.feature)
			})

			catchedLayer.remove()
		}
	})
})

const saveButton = document.getElementById("save")
saveButton.addEventListener('click', () => {
	const answer = confirm('Сохранить и выйти (страница автоматически перенаправится на главную через 6 секунд)?')
	if (answer) {
  		if (checkedLayersList.length != 0) sendEditedDataToPG(checkedLayersList)
  		setTimeout(() => document.location.href = "/", 6000)
  	}
})

let canSend = true

map.on('zoom moveend', () => { 
	if (canSend) {
		canSend = false
		const windowBounds = map.getBounds()
	    
		layersController.removeLayer(routesFakePGLayer)
		map.removeLayer(routesFakePGLayer)
		routesFakePGLayer = L.geoJSON().addTo(map)

		getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBounds)

		layersController.addOverlay(routesFakePGLayer, 'Фэйковые пешеходные данные')

		setTimeout(() => canSend = true, 1000)
	}
})