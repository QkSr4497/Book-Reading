const pg = require('pg');

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
  