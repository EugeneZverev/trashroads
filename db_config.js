const cn = {
    connectionString: 'postgres://gkzsnnak:QMaM8omjlxPUJSMlEIJaXLD5w3crbP2U@isilo.db.elephantsql.com:5432/gkzsnnak',
    max: 5
};
const pgp = require('pg-promise')();
const db = pgp(cn);

module.exports.database = db;