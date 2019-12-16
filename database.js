
function getGeoJSONLine(bLng, bLat, eLng, eLat, img, note, date, rating) {
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
                	"date": date
            	}
        	}
}

function add(bLng, bLat, eLng, eLat, img, note, date, rating) {
	db.none('INSERT INTO routes(route) VALUES($1)', [getGeoJSONLine(bLng, bLat, eLng, eLat, img, note, date, rating)])
	    .then(() => {
	        console.log("success");
	    })
	    .catch(error => {
	        console.log(error);
	    });
}
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("trashroadsFake.db"); 

/*создание таблицы Route
db.run("CREATE TABLE Routes(id PRIMARY KEY, bLng REAL NOT NULL, bLat REAL NOT NULL, eLng REAL NOT NULL, eLat REAL NOT NULL, img TEXT, note TEXT, rating INTEGER NOT NULL)", function(err){
	if(err){
		console.log(err);
	} 
	else{
		db.close();
		console.log("created db: trashroadsFake.db");
	}
});*/

/*добавление записей в таблицу Route
var statement = db.prepare("INSERT INTO Routes VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
statement.run(1, 44.006939, 56.325996, 44.008956, 56.324319, null, "terrible road", 1);
statement.run(2, 44.006939, 56.325996, 44.008151, 56.326603, null, "bad road", 2);
statement.run(3, 44.008151, 56.326603, 44.007196, 56.327561, null, "there are problems", 3);
statement.run(4, 44.007196, 56.327561, 44.005984, 56.326782, null, "good road", 4);
statement.run(5, 44.009025, 56.326391, 44.009157, 56.326654, null, null, 4);
statement.run(6, 44.009157, 56.326654, 44.009289, 56.326689, null, null, 3);
statement.run(7, 44.009289, 56.326689, 44.009495, 56.326907, null, null, 4);
statement.run(8, 44.009495, 56.326907, 44.009605, 56.3271, null, null, 3);
statement.run(9, 44.009157, 56.326654, 44.00902, 56.326733, null, null, 2);
statement.run(10, 44.00902, 56.32673, 44.009053, 56.326972, null, null, 4);
statement.run(11, 44.009053, 56.326972, 44.009162, 56.327051, null, null, 3);
statement.run(12, 44.009162, 56.327051, 44.009235, 56.327124, null, null, 2);
statement.run(13, 44.009235, 56.327124, 44.009224, 56.327293, null, null, 1);
statement.run(14, 44.009098, 56.327381, 44.008913, 56.327463, null, null, 3);
statement.run(15, 44.008913, 56.327463, 44.009039, 56.327635, null, null, 4);
statement.run(16, 44.009224, 56.327293, 44.009098, 56.327381, null, null, 2);
statement.finalize();*/

/*фэйковые данные
let statement = db.prepare("INSERT INTO Routes VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
statement.run(1, 44.018847, 56.328959, 44.017877, 56.327816, null, null, 3);
statement.run(2, 44.018847, 56.328959, 44.017086, 56.329393, null, null, 3);
statement.run(3, 44.017877, 56.327816, 44.015796, 56.328358, null, null, 3);
statement.run(4, 44.017086, 56.329393, 44.016852, 56.329415, null, null, 4);
statement.run(5, 44.016852, 56.329415, 44.015796, 56.328358, null, null, 2);
statement.run(6, 44.015796, 56.328358, 44.015458, 56.328418, null, null, 1);
statement.run(7, 44.015458, 56.328418, 44.013309, 56.328581, null, null, 4);
statement.run(8, 44.013309, 56.328581, 44.012234, 56.328682, null, null, 3);
statement.run(9, 44.012234, 56.328682, 44.012287, 56.32956, null, null, 4);
statement.run(10, 44.016852, 56.329415, 44.012287, 56.32956, null, null, 3);
statement.run(11, 44.015796, 56.328358, 44.014261, 56.326808, null, null, 3);
statement.run(12, 44.014261, 56.326808, 44.016595, 56.3263, null, null, 4);
statement.run(13, 44.018847, 56.328959, 44.016595, 56.3263, null, null, 4);
statement.run(14, 44.021029, 56.325366, 44.016595, 56.3263, null, null, 3);
statement.run(15, 44.021029, 56.325366, 44.022107, 56.326694, null, null, 4);
statement.run(16, 44.021029, 56.325366, 44.02465, 56.324619, null, null, 2);
statement.run(17, 44.02465, 56.324619, 44.025584, 56.325791, null, null, 1);
statement.run(18, 44.02465, 56.324619, 44.030955, 56.323352, null, null, 4);
statement.run(19, 44.030955, 56.323352, 44.031655, 56.324215, null, null, 3);
statement.run(20, 44.031655, 56.324215, 44.025584, 56.325791, null, null, 2);
statement.run(21, 44.031655, 56.324215, 44.032677, 56.325393, null, null, 4);
statement.run(22, 44.032677, 56.325393, 44.026531, 56.326979, null, null, 4);
statement.run(23, 44.02465, 56.324619, 44.023408, 56.32304, null, null, 3);
statement.run(24, 44.023408, 56.32304, 44.01984, 56.323879, null, null, 4);
statement.run(25, 44.01984, 56.3238799, 44.021029, 56.325366, null, null, 3);
statement.run(26, 44.01984, 56.3238799, 44.015407, 56.324938, null, null, 1);
statement.run(27, 44.015407, 56.324938, 44.016595, 56.3263, null, null, 2);
statement.run(28, 44.015407, 56.324938, 44.013323, 56.322561, null, null, 4);
statement.run(29, 44.015407, 56.324938, 44.012196, 56.325604, null, null, 3);
statement.run(30, 44.012196, 56.325604, 44.014261, 56.326808, null, null, 2);
statement.run(31, 44.012196, 56.325604, 44.008135, 56.326594, null, null, 1);
statement.run(32, 44.012196, 56.325604, 44.008902, 56.324332, null, null, 4);
statement.run(33, 44.008135, 56.326594, 44.007196, 56.32757, null, null, 2);
statement.run(34, 44.008135, 56.326594, 44.006939, 56.326008, null, null, 3);
statement.run(35, 44.008902, 56.324332, 44.006939, 56.326008, null, null, 2);
statement.run(36, 44.007196, 56.32757, 44.008554, 56.328981, null, null, 1);
statement.run(37, 44.007196, 56.32757, 44.005979, 56.326808, null, null, 4);
statement.run(38, 44.006939, 56.326008, 44.005979, 56.326808, null, null, 3);
statement.run(39, 44.008554, 56.328981, 44.012234, 56.328682, null, null, 4);
statement.run(41, 44.008554, 56.328981, 44.009238, 56.329677, null, null, 3);
statement.run(42, 44.009238, 56.329677, 44.012287, 56.32956, null, null, 2);
statement.finalize();*/

//вывод всех записей таблицы Route в консоль
/*db.all("SELECT * FROM Routes", function(err, rows){
	if(err)
	{
		console.log("ERROR");
	}
	else
	{
		for(var i = 0; i<rows.length; i++){
			var row = rows[i];
			console.log(row)
		}
	}
});*/

/*var statement = db.prepare("UPDATE Routes SET img = ? WHERE id = ?");
statement.run("dad41270-4caf-11e9-92d8-09180d711f16.jpg", 1);
statement.run("dad41271-4caf-11e9-92d8-09180d711f16.jpeg", 2);
statement.run("dad41272-4caf-11e9-92d8-09180d711f16.jpg", 3);
statement.run("dad41273-4caf-11e9-92d8-09180d711f16.jpeg", 4);
statement.run("dad41274-4caf-11e9-92d8-09180d711f16.jpg", 5);
statement.run("dad41275-4caf-11e9-92d8-09180d711f16.jpg", 12);
statement.run("dad41276-4caf-11e9-92d8-09180d711f16.jpg", 11);
statement.run("dad41277-4caf-11e9-92d8-09180d711f16.jpg", 6);
statement.run(null, 16);
statement.run("dad41278-4caf-11e9-92d8-09180d711f16.jpg", 15);
statement.finalize();*/

//var pgp = require("pg-promise")(/*options*/);
/*const cn = {
    host: 'localhost',
    port: 5432,
    database: 'trashroads',
    user: 'admin',
    password: 'password'
};

const db = pgp(cn);*/

/*db.multi("SELECT route FROM routes")
    .then(function (data) {
        console.log("DATA:", data);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });*/
/*db.none('INSERT INTO routes(route) VALUES($1)', [getGeoJSONLine(44.018847, 56.328959, 44.023072, 56.327869, "", "", "01.04.2019", 4)])
    .then(() => {
        console.log("success");
    })
    .catch(error => {
        console.log(error);
    });*/
/*db.result('DELETE FROM routes')
    .then(result => {
        // rowCount = number of rows affected by the query
        console.log(result.rowCount); // print how many records were deleted;
    })
    .catch(error => {
        console.log('ERROR:', error);
    });*/

/*add(44.018847, 56.328959, 44.023072, 56.327869, "none", "none", "01.04.2019", 4);
add(44.023072, 56.327869, 44.026531, 56.326979, "none", "none", "01.04.2019", 3);
add(44.026531, 56.326979, 44.025584, 56.325791, "none", "none", "01.04.2019", 3);
add(44.025584, 56.325791, 44.022107, 56.326694, "none", "none", "01.04.2019", 4);
add(44.022107, 56.326694, 44.017877, 56.327816, "none", "none", "01.04.2019", 4);
add(44.023072, 56.327869, 44.022107, 56.326694, "none", "none", "01.04.2019", 4);
add(44.021431, 56.326895, 44.021495, 56.326968, "none", "none", "01.04.2019", 3);*/