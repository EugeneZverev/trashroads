let mapCenter = [56.326827, 44.018];

var map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16); 

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

/*map.pm.setPathOptions({
  color: 'orange',
  fillColor: 'green',
  fillOpacity: 0.4,
});*/


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
                	"image": img
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
}/*
function drawRoute(feature) {
	L.geoJSON(feature, {
		style: getLineStyle(feature.properties.rating, 4, 1) //5, 0.65
	}).bindPopup(feature.properties.note + '<br>id:' + feature.id.toString()).addTo(map);	
}
function dynamicGetAndDrawPGData(query) {
	readServerString(`/getpgdata/${query}`, function(err, response){
		if(!err){
			var result = JSON.parse(response)[0];
			if(dynamicRoutesPGLayer) {
				dynamicRoutesPGLayer.remove();
				dynamicRoutesPGLayer = L.geoJSON().addTo(map);
			}
			for(var i = 0; i<result.length; i++){
				var row = result[i];
				dynamicRoutesPGLayer.addData(row.route);
			}
			dynamicRoutesPGLayer.eachLayer(function(layer) {  
			  	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
			});
			console.log(dynamicRoutesPGLayer._layers);
		}
	});
	console.log("success");
}
*/
function getAndDrawSQLiteData() {
	readServerString(`/getdata`, function(err, response){
		if(!err){
			var result = JSON.parse(response);
			for(var i = 0; i<result.length; i++){
				var row = result[i];
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
/*
function getURLFromLatLngBounds(bounds) {
	return `${bounds.getNorthEast().lat}&${bounds.getNorthEast().lng}&${bounds.getSouthWest().lat}&${bounds.getSouthWest().lng}`;
}*/
var secondTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

/*

/*et r42 = getGeoJSONLine(42, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r43 = getGeoJSONLine(43, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r44 = getGeoJSONLine(44, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r45 = getGeoJSONLine(45, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r46 = getGeoJSONLine(46, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);*/
     /**
var routesLayer = L.geoJSON().addTo(map);

/*routesLayer.addData(r42)
routesLayer.addData(r43)
routesLayer.addData(r44)
routesLayer.addData(r45)

*/
/**
routesLayer.eachLayer(function(layer) {  
	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
});
*/
let routesSQLiteLayer = L.geoJSON().addTo(map);
/*
var routesPGLayer = L.geoJSON().addTo(map);
*/let basemapControl = {
  "Дополнительная карта": secondTile,
  "Карта улиц": mainTile,
  "Тёмная карта": darkTheme  
}, layerControl = {
  //"Реальные данные": routesPGLayer,
  "Фэйковые данные": routesSQLiteLayer
}

getAndDrawSQLiteData();

var layersController = L.control.layers(basemapControl, layerControl).addTo(map);

let currentLayersList = []

/*for development
map.on('click', e => {
	L.popup()
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
});*/

map.on('pm:create', e => {
	currentCreatedLayer = e.layer;
	currentLayersList.push(currentCreatedLayer);

	currentCreatedLayer.on('pm:edit', e => {
		console.log('edited');
	});

	currentCreatedLayer.on('click', e => {
		console.log('CATCHED BITCH')
		catchedLayer = e.target;
		currentCoordinates = catchedLayer._latlngs;
		//console.log(currentCoordinates);
		//console.log(catchedLayer);
		newLayer = L.geoJSON().addTo(map);

		bLng = currentCoordinates[0].lng;
		bLat = currentCoordinates[0].lat;
		eLng = currentCoordinates[1].lng;
		eLat = currentCoordinates[1].lat;
		rating = 4;

		newLayer.addData(getGeoJSONLine(666, bLng, bLat, eLng, eLat, null, null, rating));
		newLayer.eachLayer(function(layer) {  
			layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
		});
		catchedLayer.remove();
		console.log(currentLayersList)
	});

	console.log(currentLayersList)
	console.log('created')
});


/*var dynamicRoutesPGLayer = L.geoJSON().addTo(map);
let query = getURLFromLatLngBounds(map.getBounds());
dynamicGetAndDrawPGData(query);

map.on('zoom moveend', function() { 
	let query = getURLFromLatLngBounds(map.getBounds());
    dynamicGetAndDrawPGData(query);
});*/