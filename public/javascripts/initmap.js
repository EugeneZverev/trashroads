import {getAndDrawRealRoutes, getURLFromLatLngBounds} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

let mapCenter = [56.326827, 44.018];	//устанавливаем координаты центра карты
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16);	//создаём объект карты с масштабом 
mainTile.addTo(map);

let routesRealOSMLayer = L.geoJSON().addTo(map);			//реальные данные OSM (smoothness), из .geojson
let routesRealPedestrianLayer = L.geoJSON().addTo(map);		//реальные данные, собранные пешеходами, из базы PG
let routesFakePGLayer = L.geoJSON().addTo(map);				//фэйковые данные, из базы PG

let windowBoundsURL = getURLFromLatLngBounds(map.getBounds());

let basemapControl = {
  "Дополнительная карта": secondTile,
  "Тёмная карта": darkTheme,
  "Карта улиц": mainTile
};
let layerControl = {
  "Данные OSM (smoothness)": routesRealOSMLayer,
  "Реальные пешеходные данные": routesRealPedestrianLayer,
  "Фэйковые пешеходные данные": routesFakePGLayer
};
let layersController = L.control.layers(basemapControl, layerControl).addTo(map);

getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBoundsURL);
getAndDrawRealRoutes('real_pedestrian', routesRealPedestrianLayer, windowBoundsURL);
getAndDrawRealRoutes('osm_smoothness', routesRealOSMLayer, windowBoundsURL);

let canSend = true;

map.on('zoom moveend', function() { 
	if(canSend===true){
		canSend = false;
		let windowBoundsURL = getURLFromLatLngBounds(map.getBounds());
	    
		layersController.removeLayer(routesFakePGLayer);
		map.removeLayer(routesFakePGLayer);
		routesFakePGLayer = L.geoJSON().addTo(map);

		getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBoundsURL);

		layersController.addOverlay(routesFakePGLayer, 'Фэйковые пешеходные данные');

		setTimeout(function run(){
			canSend = true;
  		}, 1000);
	}
});