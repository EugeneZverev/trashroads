import {getGeoJSONLine, getLineStyle, readServerString} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

let mapCenter = [56.326827, 44.018];	//устанавливаем координаты центра карты
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16);	//создаём объект карты с масштабом 
mainTile.addTo(map);

function dynamicGetAndDrawPGData(query) {
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
	//console.log("success");
}
function getAndDrawSQLiteData() {
	readServerString(`/db/getdata`, function(err, response){
		if(!err){
			let result = JSON.parse(response);
			for(let i = 0; i<result.length; i++){
				let row = result[i];
				let currentRoute = getGeoJSONLine(row.id, row.bLng, row.bLat, row.eLng, row.eLat, row.img, row.note, row.rating);
				routesSQLiteLayer.addData(currentRoute);
			}
			routesSQLiteLayer.eachLayer(function(layer) {  
			  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
			});
		} else console.log(err);
	});
	//console.log("success");
}
function getURLFromLatLngBounds(bounds) {
	return `${bounds.getNorthEast().lat}&${bounds.getNorthEast().lng}&${bounds.getSouthWest().lat}&${bounds.getSouthWest().lng}`;
}
function getAndDrawOSMData(){
	readServerString(`/get_osm_data`, function(err, response){
		if(!err){
			let result = JSON.parse(response);
			routesOSMLayer.addData(result);
			routesOSMLayer.eachLayer(function(layer) {  
				let smoothness = layer.feature.properties.smoothness;
			    let rating;
			    if(smoothness=="excellent" || smoothness=="good") rating = 4;
			    if(smoothness=="intermediate") rating = 3;
			    if(smoothness=="bad" || smoothness=="very_bad") rating = 2;
			    if(smoothness=="horrible" || smoothness=="very_horrible" || smoothness=="impassable") rating = 1;
			  	layer.setStyle(getLineStyle(rating, 3, 1));
			});			
		} else console.log(err);
	});
	//console.log("success");
}

let routesSQLiteLayer = L.geoJSON().addTo(map);
let routesOSMLayer = L.geoJSON().addTo(map);

let basemapControl = {
  "Дополнительная карта": secondTile,
  "Тёмная карта": darkTheme,
  "Карта улиц": mainTile
}, layerControl = {
  "Фэйковые данные": routesSQLiteLayer,
  "Данные OSM": routesOSMLayer
}
let layersController = L.control.layers(basemapControl, layerControl).addTo(map);

/*map.on('click', e =>{
	L.popup()
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
});*/

//let dynamicRoutesPGLayer = L.geoJSON().addTo(map);
//let query = getURLFromLatLngBounds(map.getBounds());
//dynamicGetAndDrawPGData(query);

getAndDrawSQLiteData();
getAndDrawOSMData();

/*map.on('zoom moveend', function() { 
	let query = getURLFromLatLngBounds(map.getBounds());
    dynamicGetAndDrawPGData(query);
});*/