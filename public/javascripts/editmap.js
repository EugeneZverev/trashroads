import {getGeoJSONLine, getLineStyle, readServerString} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

let mapCenter = [56.326827, 44.018];	//устанавливаем координаты центра карты
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16);	//создаём объект карты с масштабом
darkTheme.addTo(map);

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
});

let numberOfRoutesFromBase = null;	//количество участков, полученных из базы
let currentID = null;	//номер текущего добавляемого участка

let routesRealPedestrianLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map);		//реальные данные, собранные пешеходами, из базы PG
let routesFakePGLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map);				//фэйковые данные, из базы PG

let basemapControl = {
	"Карта улиц": mainTile,
	"Дополнительная карта": secondTile,
	"Тёмная карта": darkTheme  
};
let layerControl = {
	"Реальные пешеходные данные": routesRealPedestrianLayer,
	"Фэйковые пешеходные данные": routesFakePGLayer
};
let layersController = L.control.layers(basemapControl, layerControl).addTo(map);

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

/*function getAndDrawSQLiteData() {
	readServerString(`/db/getdata`, function(err, response){
		if(!err){
			let result = JSON.parse(response);
			numberOfRoutesFromBase = result.length;
			//console.log(numberOfRoutesFromBase);
			currentID = numberOfRoutesFromBase + 1;
			for(var i = 0; i<result.length; i++){
				let row = result[i];
				let currentRoute = getGeoJSONLine(row.id, row.bLng, row.bLat, row.eLng, row.eLat, row.img, row.note, row.rating);
				routesSQLiteLayer.addData(currentRoute);
			}
			routesSQLiteLayer.eachLayer(function(layer) {  
			  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
			});
		}
	});
	//console.log("success");
}*/
function sendEditedDataToSQLite(query) {
	readServerString(`/db/send_routes/${query}`, function(err, response){
		if(!err) console.log(err);
	});
}

getAndDrawRealRoutes('fake_pedestrian');
getAndDrawRealRoutes('real_pedestrian');

let currentLayersList = [];
let checkedLayersList = [];

/*for development
map.on('click', e => {
	L.popup()
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
});*/

map.on('pm:create', e => {
	let currentCreatedLayer = e.layer;
	currentLayersList.push(currentCreatedLayer);

	currentCreatedLayer.on('click', e => {
		let rating = prompt('УКАЖИТЕ СОСТОЯНИЕ УЧАСТКА(ОТ 1 - ОЧЕНЬ ПЛОХО, ДО 4 - ОТЛИЧНО', '');
		let catchedLayer = e.target;
		let currentCoordinatesArray = catchedLayer._latlngs;
		let newLayer = L.geoJSON().addTo(map);
		if(rating==1 || rating==2 || rating==3 || rating==4){
			for (let point = 0; point < currentCoordinatesArray.length-1; point++){
				let bLng = currentCoordinatesArray[point].lng;
				let bLat = currentCoordinatesArray[point].lat;
				let eLng = currentCoordinatesArray[point+1].lng;
				let eLat = currentCoordinatesArray[point+1].lat;

				let now = new Date();

				let currentRoute = getGeoJSONLine(currentID, bLng, bLat, eLng, eLat, null, null, rating);
				newLayer.addData(currentRoute);
				currentID++;
			}
			newLayer.eachLayer(function(layer) {  
					layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
					checkedLayersList.push(layer.feature);
			});
			catchedLayer.remove();
		}
	});
	//console.log('created')
});

//сохранение, отправка данных в базу, перенаправление на главную страницу
const saveButton = document.getElementById("save");
saveButton.addEventListener('click', function(e){
	let answer = confirm('Сохранить и выйти (страница автоматически перенаправится на главную через 6 секунд)?');
	if(answer){
  		if(checkedLayersList.length!=0){
  			let objectToSend = JSON.stringify(checkedLayersList);
			sendEditedDataToSQLite(objectToSend);
  		}
  		setTimeout(function run(){
			document.location.href = "/";
  		}, 6000);
  	}
});