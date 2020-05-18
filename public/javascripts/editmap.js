import {getGeoJSONLine, getLineStyle, readServerString, getAndDrawRealRoutes, getURLFromLatLngBounds} from './generalObjects.js';		//импортируем функции из файла
import {mainTile, secondTile, darkTheme} from './generalObjects.js';	//импортируем объекты из файла

function sendEditedDataToSQLite(query) {
	readServerString(`/db/send_routes/${query}`, function(err, response){
		if(!err) console.log(err);
	});
}

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

let routesRealPedestrianLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map);		//реальные данные, собранные пешеходами, из базы PG
let routesFakePGLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map);				//фэйковые данные, из базы PG

let windowBoundsURL = getURLFromLatLngBounds(map.getBounds());

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

getAndDrawRealRoutes('fake_pedestrian', routesFakePGLayer, windowBoundsURL);
getAndDrawRealRoutes('real_pedestrian', routesRealPedestrianLayer, windowBoundsURL);

let currentLayersList = [], checkedLayersList = [];

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
				let currentRoute = getGeoJSONLine(null, bLng, bLat, eLng, eLat, null, null, now, rating);
				newLayer.addData(currentRoute);
			}
			newLayer.eachLayer(function(layer) {  
					layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
					checkedLayersList.push(layer.feature);
			});
			catchedLayer.remove();
		}
	});
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