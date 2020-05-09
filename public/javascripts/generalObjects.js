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

export {getGeoJSONLine, getLineStyle, readServerString};
export {mainTile, secondTile, darkTheme};