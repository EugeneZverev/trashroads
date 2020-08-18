const cn = {
    connectionString: process.env.DB_CONNECTION,
    max: 5
};
const pgp = require('pg-promise')();
const db = pgp(cn);

module.exports.database = db;