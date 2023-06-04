const Pool = require('pg').Pool;
const pool = new Pool({
    server: 'localhost',
    user: 'postgres',
    port: 5432,
    password: "1234",
    database: 'crms'
})

module.exports = pool;