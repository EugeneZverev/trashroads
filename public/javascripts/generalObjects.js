let mainTile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
});
let secondTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

function getGeoJSONLine(id, bLng, bLat, eLng, eLat, img, note, time_stamp, rating) {
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
                	"date": time_stamp
            	},
            	"id": id
        	}
}
function getLineStyle(rating, weight, opacity) {
	let color = "";
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
function readServerString(url, callback) {
    let req = new XMLHttpRequest();
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
function getAndDrawRealRoutes(query, workingLayer){
    readServerString(`/db/get_routes/${query}`, function(err, response){
        if(!err){
            let result = JSON.parse(response);
            if(query==='real_pedestrian' || query==='fake_pedestrian'){
                for(let i = 0; i<result[0].length; i++){
                    let row = result[0][i];
                    let currentRoute = getGeoJSONLine(row.route_id, row.blng, row.blat, row.elng, row.elat, row.img, row.note, row.time_stamp, row.rating);
                    workingLayer.addData(currentRoute);
                }
                workingLayer.eachLayer(function(layer) {  
                    layer.setStyle(getLineStyle(layer.feature.properties.rating, 3, 1));
                });
            }
            if(query==='osm_smoothness'){
                workingLayer.addData(result);
                workingLayer.eachLayer(function(layer) {  
                    let smoothness = layer.feature.properties.smoothness;
                    let rating;
                    if(smoothness=="excellent" || smoothness=="good") rating = 4;
                    if(smoothness=="intermediate") rating = 3;
                    if(smoothness=="bad" || smoothness=="very_bad") rating = 2;
                    if(smoothness=="horrible" || smoothness=="very_horrible" || smoothness=="impassable") rating = 1;
                    layer.setStyle(getLineStyle(rating, 3, 1));
                });
            }
        } else console.log(err);
    });
}

export {getGeoJSONLine, getLineStyle, readServerString, getAndDrawRealRoutes};
export {mainTile, secondTile, darkTheme};