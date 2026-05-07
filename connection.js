"use strict";
/**
 * @file connection.js
 * @description Creates and exports a mysql2 connection pool for the fastfood database.
 */
var mysql = require('mysql2/promise');
const logger = require('./logger.js');

/** @type {import('mysql2/promise').Pool} */
let pool;


logger.log(logger.LOGTYPE.INFO, `[db] connecting...`);
    pool = mysql.createPool({
        host: "localhost",
        port : 3306,
        user: "fastfood",
        password: "fastfood",
        database: "fastfood",
        waitForConnections: true,
        connectionLimit: 10,
    });

logger.log(logger.LOGTYPE.INFO, `[db] connected to database`);


pool.getConnection((err,connection)=> {
    if(err)
        throw err;
    connection.release();
});

module.exports = pool;
