import {getAndDrawRealRoutes} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

let mapCenter = [56.326827, 44.018];	//устанавливаем координаты центра карты
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16);	//создаём объект карты с масштабом 
mainTile.addTo(map);

let routesRealOSMLayer = L.geoJSON().addTo(map);			//реальные данные OSM (smoothness), из .geojson
let routesRealPedestrianLayer = L.geoJSON().addTo(map);		//реальные данные, собранные пешеходами, из базы PG
let routesFakePGLayer = L.geoJSON().addTo(map);				//фэйковые данные, из базы PG

let basemapControl = {
  "Дополнительная карта": secondTile,
  "Тёмная карта": darkTheme,
  "Карта улиц": mainTile
};
let layerControl = {
  "Реальные пешеходные данные": routesRealPedestrianLayer,
  "Фэйковые пешеходные данные": routesFakePGLayer,
  "Данные OSM (smoothness)": routesRealOSMLayer
};
let layersController = L.control.layers(basemapControl, layerControl).addTo(map);

getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer);
getAndDrawRealRoutes('real_pedestrian', routesRealPedestrianLayer);
getAndDrawRealRoutes('osm_smoothness', routesRealOSMLayer);

//let dynamicRoutesPGLayer = L.geoJSON().addTo(map);
//let query = getURLFromLatLngBounds(map.getBounds());
//dynamicGetAndDrawPGData(query);

/*map.on('zoom moveend', function() { 
	let query = getURLFromLatLngBounds(map.getBounds());
    dynamicGetAndDrawPGData(query);
});*/

/*function dynamicGetAndDrawPGData(query) {
	readServerString(`/db/getpgdata/${query}`, function(err, response){
		if(!err){
			let result = JSON.parse(response)[0];
			if(dynamicRoutesPGLayer) {
				dynamicRoutesPGLayer.remove();
				dynamicRoutesPGLayer = L.geoJSON().addTo(map);
			}
			for(let i = 0; i<result.length; i++){
				let row = result[i];
				dynamicRoutesPGLayer.addData(row.route);
			}
			dynamicRoutesPGLayer.eachLayer(function(layer) {  
			  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
			});
			//console.log(dynamicRoutesPGLayer._layers);
		} else console.log(err);
	});
}
function getURLFromLatLngBounds(bounds) {
	return `${bounds.getNorthEast().lat}&${bounds.getNorthEast().lng}&${bounds.getSouthWest().lat}&${bounds.getSouthWest().lng}`;
}*/