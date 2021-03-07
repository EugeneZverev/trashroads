import {getAndDrawRealRoutes} from './generalObjects.js'	 
import {mainTile, darkTheme} from './generalObjects.js'	 

const mapCenter = [56.326827, 44.018]	 
const mapScale = 16
const map = L.map('mapid', {zoomControl: false}).setView(mapCenter, mapScale)	 

mainTile.addTo(map)

const routesRealOSMLayer = L.geoJSON().addTo(map)			
const routesRealPedestrianLayer = L.geoJSON().addTo(map)		
let routesFakePGLayer = L.geoJSON().addTo(map)		

const basemapControl = {
  "Карта улиц": mainTile,
  "Тёмная карта": darkTheme
}
const layerControl = {
  "Данные OSM (smoothness)": routesRealOSMLayer,
  "Реальные пешеходные данные": routesRealPedestrianLayer,
  "Фэйковые пешеходные данные": routesFakePGLayer
}
const layersController = L.control.layers(basemapControl, layerControl).addTo(map)

const windowBounds = map.getBounds()
getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBounds)
getAndDrawRealRoutes('real_pedestrian', routesRealPedestrianLayer, windowBounds)
getAndDrawRealRoutes('osm_smoothness', routesRealOSMLayer, windowBounds)

let canSend = true
map.on('zoom moveend', () => { 
	if (canSend) {
		canSend = false
		let windowBounds = map.getBounds()
	    
		layersController.removeLayer(routesFakePGLayer)
		map.removeLayer(routesFakePGLayer)
		routesFakePGLayer = L.geoJSON().addTo(map)

		getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBounds)

		layersController.addOverlay(routesFakePGLayer, 'Фэйковые пешеходные данные')

		setTimeout(() => canSend = true, 1000)
	}
})