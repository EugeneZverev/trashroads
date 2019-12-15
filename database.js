
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
/*ar sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("trashroads.db"); 

/*создание таблицы Route
db.run("CREATE TABLE Routes(id PRIMARY KEY, bLng REAL NOT NULL, bLat REAL NOT NULL, eLng REAL NOT NULL, eLat REAL NOT NULL, img TEXT, note TEXT, rating INTEGER NOT NULL)", function(err){
	if(err){
		console.log(err);
	} 
	else{
		db.close();
		console.log("created db: trashroads.db");
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

/*вывод всех записей таблицы Route в консоль
db.all("SELECT * FROM Routes", function(err, rows){
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

var pgp = require("pg-promise")(/*options*/);
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'trashroads',
    user: 'admin',
    password: 'password'
};

const db = pgp(cn);

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