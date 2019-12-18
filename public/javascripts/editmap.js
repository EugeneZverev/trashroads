let mapCenter = [56.326827, 44.018];
let map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16); 

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

let secondTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
	mainTile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 19,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}), 
	darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

let routesCountFromBase = null;
let currentID = null;

let routesSQLiteLayer = L.geoJSON(null, {pmIgnore: true}).addTo(map);

let basemapControl = {
	"Дополнительная карта": secondTile,
	"Карта улиц": mainTile,
	"Тёмная карта": darkTheme  
}, 
layerControl = {
  	"Фэйковые данные": routesSQLiteLayer
}
let layersController = L.control.layers(basemapControl, layerControl).addTo(map);

function readServerString(url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(req.readyState ===4){
        if(req.status===200){
          callback(undefined, req.responseText);
        } 
        else{
          callback(new Error(req.status));
        }
      }
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send();
}

function getGeoJSONLine(id, bLng, bLat, eLng, eLat, img, note, rating) {
	return {
            	"type": "Feature",
            	"geometry": {
                	"type": "LineString",
                	"coordinates": [
                	    [bLng, bLat],
                	    [eLng, eLat]
                	]
            	},
            	"properties": {
            	    "note": note,
            	    "rating": rating,
                	"image": img,
                	"date": null
            	},
            	"id": id
        	}
}

function getLineStyle(rating, weight, opacity) {
	if(rating==1) color = "#cc0000";
	if(rating==2) color = "#ff7800";
	if(rating==3) color = "#ffcc00";
	if(rating==4) color = "#53ff1a";
	return {
				"color": color,
				"weight": weight,
				"opacity": opacity
			}
}

function getAndDrawSQLiteData() {
	readServerString(`/db/getdata`, function(err, response){
		if(!err){
			let result = JSON.parse(response);
			routesCountFromBase = result.length;
			currentID = routesCountFromBase + 1;
			for(var i = 0; i<result.length; i++){
				let row = result[i];
				currentRoute = getGeoJSONLine(row.id, row.bLng, row.bLat, row.eLng, row.eLat, row.img, row.note, row.rating);
				routesSQLiteLayer.addData(currentRoute);
			}
			routesSQLiteLayer.eachLayer(function(layer) {  
			  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
			});
		}
	});
	console.log("success");
}

function sendEditedDataToSQLite(query) {
	readServerString(`/db/senddata/${query}`, function(err, response){
		if(!err){
			console.log(err);
		}
	});
}

getAndDrawSQLiteData();

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
	console.log(routesCountFromBase)
	currentCreatedLayer = e.layer;
	currentLayersList.push(currentCreatedLayer);

	currentCreatedLayer.on('pm:edit', e => {
		console.log('edited');
	});

	currentCreatedLayer.on('click', e => {
		console.log('CATCHED BITCH')
		rating = prompt('УКАЖИТЕ СОСТОЯНИЕ УЧАСТКА(ОТ 1 - ОЧЕНЬ ПЛОХО, ДО 4 - ОТЛИЧНО', '');
		catchedLayer = e.target;
		currentCoordinatesArray = catchedLayer._latlngs;
		newLayer = L.geoJSON().addTo(map);

		if(rating==1 || rating==2 || rating==3 || rating==4){
			for (let point = 0; point < currentCoordinatesArray.length-1; point++){
				//console.log(currentCoordinatesArray[point])
				bLng = currentCoordinatesArray[point].lng;
				bLat = currentCoordinatesArray[point].lat;
				eLng = currentCoordinatesArray[point+1].lng;
				eLat = currentCoordinatesArray[point+1].lat;
				currentRoute = getGeoJSONLine(currentID, bLng, bLat, eLng, eLat, null, null, rating);
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
	console.log('created')
});

const button = document.getElementById("save");
button.addEventListener('click', function(e) {
  answer = confirm('Сохранить и выйти (страница автоматически перенаправится через 6 секунд, подождите)?');
  console.log(answer);
  if (answer){
  	console.log(JSON.stringify(checkedLayersList))
  	if(checkedLayersList.length!=0){
  		let objectToSend = JSON.stringify(checkedLayersList);
		sendEditedDataToSQLite(objectToSend);
  	}
  	setTimeout(function run(){
		document.location.href = "/";
  	}, 6000);
  }
});