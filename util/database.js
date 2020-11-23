//importing mysql2 package
const mysql = require('mysql2');

//creating a connection pool for our use
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_SCHEMA,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

//exporting the promise from connection pool
module.exports = pool.promise();