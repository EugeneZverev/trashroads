let mapCenter = [56.326827, 44.018];

var map = L.map('mapid', {zoomControl: false}).setView(mapCenter, 16); 

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
}
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
function getURLFromLatLngBounds(bounds) {
	return `${bounds.getNorthEast().lat}&${bounds.getNorthEast().lng}&${bounds.getSouthWest().lat}&${bounds.getSouthWest().lng}`;
}
var darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}),
	secondTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
	mainTile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 19,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'

}).addTo(map);


let r1 = getGeoJSONLine(1, 44.018847, 56.328959, 44.017877, 56.327816, null, null, 3);
let r2 = getGeoJSONLine(2, 44.018847, 56.328959, 44.017086, 56.329393, null, null, 3);
let r3 = getGeoJSONLine(3, 44.017877, 56.327816, 44.015796, 56.328358, null, null, 3);
let r4 = getGeoJSONLine(4, 44.017086, 56.329393, 44.016852, 56.329415, null, null, 4);
let r5 = getGeoJSONLine(5, 44.016852, 56.329415, 44.015796, 56.328358, null, null, 2);
let r6 = getGeoJSONLine(6, 44.015796, 56.328358, 44.015458, 56.328418, null, null, 1);
let r7 = getGeoJSONLine(7, 44.015458, 56.328418, 44.013309, 56.328581, null, null, 4);
let r8 = getGeoJSONLine(8, 44.013309, 56.328581, 44.012234, 56.328682, null, null, 3);
let r9 = getGeoJSONLine(9, 44.012234, 56.328682, 44.012287, 56.32956, null, null, 4);
let r10 = getGeoJSONLine(10, 44.016852, 56.329415, 44.012287, 56.32956, null, null, 3);
let r11 = getGeoJSONLine(11, 44.015796, 56.328358, 44.014261, 56.326808, null, null, 3);
let r12 = getGeoJSONLine(12, 44.014261, 56.326808, 44.016595, 56.3263, null, null, 4);
let r13 = getGeoJSONLine(13, 44.018847, 56.328959, 44.016595, 56.3263, null, null, 4);
let r14 = getGeoJSONLine(14, 44.021029, 56.325366, 44.016595, 56.3263, null, null, 3);
let r15 = getGeoJSONLine(15, 44.021029, 56.325366, 44.022107, 56.326694, null, null, 4);
let r16 = getGeoJSONLine(16, 44.021029, 56.325366, 44.02465, 56.324619, null, null, 2);
let r17 = getGeoJSONLine(17, 44.02465, 56.324619, 44.025584, 56.325791, null, null, 1);
let r18 = getGeoJSONLine(18, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r19 = getGeoJSONLine(19, 44.030955, 56.323352, 44.031655, 56.324215, null, null, 3);
let r20 = getGeoJSONLine(20, 44.031655, 56.324215, 44.025584, 56.325791, null, null, 2);
let r21 = getGeoJSONLine(21, 44.031655, 56.324215, 44.032677, 56.325393, null, null, 4);
let r22 = getGeoJSONLine(22, 44.032677, 56.325393, 44.026531, 56.326979, null, null, 4);
let r23 = getGeoJSONLine(23, 44.02465, 56.324619, 44.023408, 56.32304, null, null, 3);
let r24 = getGeoJSONLine(24, 44.023408, 56.32304, 44.01984, 56.323879, null, null, 4);
let r25 = getGeoJSONLine(25, 44.01984, 56.3238799, 44.021029, 56.325366, null, null, 3);
let r26 = getGeoJSONLine(26, 44.01984, 56.3238799, 44.015407, 56.324938, null, null, 1);
let r27 = getGeoJSONLine(27, 44.015407, 56.324938, 44.016595, 56.3263, null, null, 2);
let r28 = getGeoJSONLine(28, 44.015407, 56.324938, 44.013323, 56.322561, null, null, 4);
let r29 = getGeoJSONLine(29, 44.015407, 56.324938, 44.012196, 56.325604, null, null, 3);
let r30 = getGeoJSONLine(30, 44.012196, 56.325604, 44.014261, 56.326808, null, null, 2);
let r31 = getGeoJSONLine(31, 44.012196, 56.325604, 44.008135, 56.326594, null, null, 1);
let r32 = getGeoJSONLine(32, 44.012196, 56.325604, 44.008902, 56.324332, null, null, 4);
let r33 = getGeoJSONLine(33, 44.008135, 56.326594, 44.007196, 56.32757, null, null, 2);
let r34 = getGeoJSONLine(34, 44.008135, 56.326594, 44.006939, 56.326008, null, null, 3);
let r35 = getGeoJSONLine(35, 44.008902, 56.324332, 44.006939, 56.326008, null, null, 2);
let r36 = getGeoJSONLine(36, 44.007196, 56.32757, 44.008554, 56.328981, null, null, 1);
let r37 = getGeoJSONLine(37, 44.007196, 56.32757, 44.005979, 56.326808, null, null, 4);
let r38 = getGeoJSONLine(38, 44.006939, 56.326008, 44.005979, 56.326808, null, null, 3);
let r39 = getGeoJSONLine(39, 44.008554, 56.328981, 44.012234, 56.328682, null, null, 4);
let r41 = getGeoJSONLine(41, 44.008554, 56.328981, 44.009238, 56.329677, null, null, 3);

let r40 = getGeoJSONLine(42, 44.009238, 56.329677, 44.012287, 56.32956, null, null, 2);

/*et r42 = getGeoJSONLine(42, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r43 = getGeoJSONLine(43, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r44 = getGeoJSONLine(44, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r45 = getGeoJSONLine(45, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
let r46 = getGeoJSONLine(46, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);*/
     
var routesLayer = L.geoJSON().addTo(map);

routesLayer.addData(r1);
routesLayer.addData(r2);
routesLayer.addData(r3);
routesLayer.addData(r4);
routesLayer.addData(r5);
routesLayer.addData(r6);
routesLayer.addData(r7);
routesLayer.addData(r8);
routesLayer.addData(r9);
routesLayer.addData(r10);
routesLayer.addData(r11);
routesLayer.addData(r12);
routesLayer.addData(r13);
routesLayer.addData(r14);
routesLayer.addData(r15);
routesLayer.addData(r16);
routesLayer.addData(r17);
routesLayer.addData(r18);
routesLayer.addData(r19);
routesLayer.addData(r20);
routesLayer.addData(r21);
routesLayer.addData(r22);
routesLayer.addData(r23);
routesLayer.addData(r24);
routesLayer.addData(r25);
routesLayer.addData(r26);
routesLayer.addData(r27);
routesLayer.addData(r28);
routesLayer.addData(r29);
routesLayer.addData(r30);
routesLayer.addData(r31);
routesLayer.addData(r32);
routesLayer.addData(r33);
routesLayer.addData(r34);
routesLayer.addData(r35);
routesLayer.addData(r36);
routesLayer.addData(r37);
routesLayer.addData(r38);
routesLayer.addData(r39);
routesLayer.addData(r41);
routesLayer.addData(r40)
/*routesLayer.addData(r42)
routesLayer.addData(r43)
routesLayer.addData(r44)
routesLayer.addData(r45)

*/

routesLayer.eachLayer(function(layer) {  
	layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
});


var routesPGLayer = L.geoJSON().addTo(map);
let basemapControl = {
  "Дополнительная карта": secondTile,
  "Тёмная карта": darkTheme,
  "Карта улиц": mainTile
}, layerControl = {
  "Реальные данные": routesPGLayer,
  "Фэйковые данные": routesLayer
}

var layersController = L.control.layers(basemapControl, layerControl).addTo(map);

function onMapClick(e) {
	L.popup()
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
}

map.on('click', onMapClick);

var dynamicRoutesPGLayer = L.geoJSON().addTo(map);
let query = getURLFromLatLngBounds(map.getBounds());
//dynamicGetAndDrawPGData(query);

/*map.on('zoom moveend', function() { 
	let query = getURLFromLatLngBounds(map.getBounds());
    dynamicGetAndDrawPGData(query);
});*/