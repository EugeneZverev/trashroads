import {getGeoJSONLine, getLineStyle, readServerString} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

let mapCenter = [56.326827, 44.018];	//устанавливаем координаты центра карты
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16);	//создаём объект карты с масштабом 
mainTile.addTo(map);

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

function getAndDrawRealRoutes(query){
	readServerString(`/db/get_routes/${query}`, function(err, response){
		if(!err){
			let result = JSON.parse(response);
			if(query==='real_pedestrian'){
				for(let i = 0; i<result[0].length; i++){
					let row = result[0][i];
					let date = row.time_stamp;
					let currentRoute = getGeoJSONLine(row.route_id, row.blng, row.blat, row.elng, row.elat, row.img, row.note, row.rating);
					routesRealPedestrianLayer.addData(currentRoute);
				}
				routesRealPedestrianLayer.eachLayer(function(layer) {  
				  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
				});
			}
			if(query==='osm_smoothness'){
				routesRealOSMLayer.addData(result);
				routesRealOSMLayer.eachLayer(function(layer) {  
					let smoothness = layer.feature.properties.smoothness;
				    let rating;
				    if(smoothness=="excellent" || smoothness=="good") rating = 4;
				    if(smoothness=="intermediate") rating = 3;
				    if(smoothness=="bad" || smoothness=="very_bad") rating = 2;
				    if(smoothness=="horrible" || smoothness=="very_horrible" || smoothness=="impassable") rating = 1;
				  	layer.setStyle(getLineStyle(rating, 3, 1));
				});			
			}
			if(query==='fake_pedestrian'){
				for(let i = 0; i<result[0].length; i++){
					let row = result[0][i];
					let date = row.time_stamp;
					let currentRoute = getGeoJSONLine(row.route_id, row.blng, row.blat, row.elng, row.elat, row.img, row.note, row.rating);
					routesFakePGLayer.addData(currentRoute);
				}
				routesFakePGLayer.eachLayer(function(layer) {  
				  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
				});
			}
		} else console.log(err);
	});
}

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

//let dynamicRoutesPGLayer = L.geoJSON().addTo(map);
//let query = getURLFromLatLngBounds(map.getBounds());
//dynamicGetAndDrawPGData(query);

getAndDrawRealRoutes('fake_pedestrian');
getAndDrawRealRoutes('real_pedestrian');
getAndDrawRealRoutes('osm_smoothness');


/*map.on('zoom moveend', function() { 
	let query = getURLFromLatLngBounds(map.getBounds());
    dynamicGetAndDrawPGData(query);
});*/