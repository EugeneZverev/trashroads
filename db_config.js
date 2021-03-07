const config = require("./config.js")
const pgp = require('pg-promise')()

const cn = {
    connectionString: process.env.DB_CONNECTION || config.config.pgAccessToken,
    max: 5
}
const db = pgp(cn)

module.exports.database = db