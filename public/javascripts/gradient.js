
const green_red = ["#cc0000",
			 	  "#cc0d03",
			 	  "#cc1a05",
			 	  "#cc2608",
			 	  "#cc330a",
			 	  "#cc400d",
			 	  "#cc4c0f",
			 	  "#cc5912",
			 	  "#cc6614",
			 	  "#cc7317",
			 	  "#cc801a",
			 	  "#cc8c1c",
			 	  "#cc991f",
			 	  "#cca621",
			 	  "#ccb224",
			 	  "#ccbf26",
			 	  "#cccc29",
			 	  "#ccd92b",
			 	  "#cce62e",
			 	  "#ccf230",
			  	  "#ccff33"];
const yellow_red = ["#cc0000",
			 	   "#cf0a00",
			 	   "#d11400",
			 	   "#d41f00",
			 	   "#d62900",
			 	   "#d93300",
			 	   "#db3d00",
			 	   "#de4700",
			 	   "#e05200",
			 	   "#e35c00",
			 	   "#e66600",
			 	   "#e87000",
			 	   "#eb7a00",
			 	   "#ed8500",
			 	   "#f08f00",
			 	   "#f29900",
			 	   "#f5a300",
			 	   "#f7ad00",
			 	   "#fab800",
			 	   "#fcc200",
			       "#ffcc00"];
const orange_red = ["#cc0000",
			 	   "#cf0600",
			 	   "#d10c00",
			 	   "#d41200",
			 	   "#d61800",
			 	   "#d91e00",
			 	   "#db2400",
			 	   "#de2a00",
			 	   "#e03000",
			 	   "#e33600",
			 	   "#e63c00",
			 	   "#e84200",
			 	   "#eb4800",
			 	   "#ed4e00",
			 	   "#f05400",
			 	   "#f25a00",
			 	   "#f56000",
			 	   "#f76600",
			 	   "#fa6c00",
			 	   "#fc7200",
  				   "#ff7800"];
const green_orange = ["#ff7800",
			 	     "#fc7f03",
			 	     "#fa8605",
			 	     "#f78c08",
			 	     "#f5930a",
			 	     "#f29a0d",
			 	     "#f0a00f",
			 	     "#eda712",
			 	     "#ebae14",
			 	     "#e8b517",
			 	     "#e6bc1a",
			 	     "#e3c21c",
			 	     "#e0c91f",
			         "#ded021",
			 	     "#dbd624",
			 	     "#d9dd26",
			 	     "#d6e429",
			 	     "#d4eb2b",
			 	     "#d1f22e",
			 	     "#cff830",
			  		 "#ccff33"];
const yellow_orange = ["#ff7800",
			 	      "#ff7c00",
			 	  	  "#ff8000",
				 	  "#ff8500",
				 	  "#ff8900",
				 	  "#ff8d00",
				 	  "#ff9100",
				 	  "#ff9500",
				 	  "#ff9a00",
				 	  "#ff9e00",
				 	  "#ffa200",
				 	  "#ffa600",
				 	  "#ffaa00",
				 	  "#ffaf00",
				 	  "#ffb300",
				 	  "#ffb700",
				 	  "#ffbb00",
				 	  "#ffbf00",
				 	  "#ffc400",
				 	  "#ffc800",
				      "#ffcc00"];
const green_yellow = ["#ffcc00",
				 	 "#fccf03",
				 	 "#fad105",
				 	 "#f7d408",
				 	 "#f5d60a",
				 	 "#f2d90d",
				 	 "#f0db0f",
				 	 "#edde12",
				 	 "#ebe014",
				 	 "#e8e317",
				 	 "#e6e61a",
				 	 "#e3e81c",
				 	 "#e0eb1f",
				 	 "#deed21",
				 	 "#dbf024",
				 	 "#d9f226",
				 	 "#d6f529",
				 	 "#d4f72b",
				 	 "#d1fa2e",
				 	 "#cffc30",
				     "#ccff33"];

function drawGradientRoute(feature, map, gradient, reverse) {
	//lng = k*lat + b
	var bLng = feature.geometry.coordinates[0][0],
		bLat = feature.geometry.coordinates[0][1],
		eLng = feature.geometry.coordinates[1][0],
		eLat = feature.geometry.coordinates[1][1];
	var k = (eLng-bLng)/(eLat-bLat);
	var b = bLng - k*bLat;
	var grad, num = 21;
	var step = (eLat-bLat)/num;
	var currentLat = eLat,
		currentLng = eLng;
	if(gradient=="green_red") grad = green_red;
		else if(gradient=="yellow_red") grad = yellow_red;
		else if(gradient=="orange_red") grad = orange_red;
		else if(gradient=="green_yellow") grad = green_yellow;
		else if(gradient=="green_orange") grad = green_orange;
		else if(gradient=="yellow_orange") grad = yellow_orange;
	if(reverse) grad.reverse();
	for(i = num; i>0; i--){
		lastLat = currentLat;
		lastLng = currentLng;
		currentLat -= step;
		currentLng = k*currentLat + b;
		feature = getGeoJSONLine(19, lastLng, lastLat, currentLng, currentLat, "", 1);
		L.geoJSON(feature, {
			style: {
				"color": grad[i-1],
				"weight": 5,
				"opacity": 1
			}
		}).bindPopup(feature.properties.note).addTo(map);	
	}
	if(reverse) grad.reverse();
}

/*var test1 = getGeoJSONLine(1, 44.006939, 56.325996, 44.008956, 56.324319, "terrible road", 1);
var test2 = getGeoJSONLine(2, 44.006939, 56.325996, 44.008151, 56.326603, "bad road", 2);
var test3 = getGeoJSONLine(3, 44.008151, 56.326603, 44.007196, 56.327561, "there are problems", 3);
var test4 = getGeoJSONLine(4, 44.007196, 56.327561, 44.005984, 56.326782, "good road", 4);
var test5 = getGeoJSONLine(5, 44.009025, 56.326391, 44.009157, 56.326654, "", 4);
var test6 = getGeoJSONLine(6, 44.009157, 56.326654, 44.009289, 56.326689, "", 3);
var test7 = getGeoJSONLine(7, 44.009289, 56.326689, 44.009495, 56.326907, "", 4);
var test8 = getGeoJSONLine(8, 44.009495, 56.326907, 44.009605, 56.3271, "", 3);
var test9 = getGeoJSONLine(9, 44.009157, 56.326654, 44.00902, 56.326733, "", 2);
var test10 = getGeoJSONLine(10, 44.00902, 56.32673, 44.009053, 56.326972, "", 4);
var test11 = getGeoJSONLine(11, 44.009053, 56.326972, 44.009162, 56.327051, "", 3);
var test12= getGeoJSONLine(12, 44.009162, 56.327051, 44.009235, 56.327124, "", 2);
var test13= getGeoJSONLine(13, 44.009235, 56.327124, 44.009224, 56.327293, "", 1);
var test14= getGeoJSONLine(16, 44.009224, 56.327293, 44.009098, 56.327381, "", 2);
var test15= getGeoJSONLine(14, 44.009098, 56.327381, 44.008913, 56.327463, "", 3);
var test16= getGeoJSONLine(15, 44.008913, 56.327463, 44.009039, 56.327635, "", 4);
*/

/*drawGradientRoute(test5, map, "green_yellow", true);
drawGradientRoute(test6, map, "green_yellow", false);
drawGradientRoute(test7, map, "green_yellow", true);
drawGradientRoute(test9, map, "green_orange", false);
drawGradientRoute(test10, map, "green_yellow", true);
drawGradientRoute(test11, map, "yellow_orange", true);
drawGradientRoute(test12, map, "orange_red", true);
drawGradientRoute(test13, map, "orange_red", false);
drawGradientRoute(test14, map, "yellow_orange", false);
drawGradientRoute(test15, map, "green_yellow", false);*/