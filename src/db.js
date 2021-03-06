const pg = require('pg');

// console.log('process.env.SQL_USER: ' + process.env.SQL_USER)
// console.log('process.env.SQL_PASSWORD: ' + process.env.SQL_PASSWORD)
// console.log('process.env.SQL_HOST: ' + process.env.SQL_HOST)
// console.log('process.env.SQL_PORT: ' + process.env.SQL_PORT)
// console.log('process.env.SQL_DATABASE: ' + process.env.SQL_DATABASE)

const pg_pool = new pg.Pool({
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DATABASE
});


module.exports = {
    pg_pool,
    query: (text, params) => pg_pool.query(text, params)
  }
  