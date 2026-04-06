"use strict";
var mysql = require('mysql2/promise');
const logger = require('./logger.js');

let pool;


logger.log(logger.LOGTYPE.INFO, `[db] connecting...`);
    pool = mysql.createPool({
        host: "localhost",
        port : 3306,
        user: "root",
        password: "root",
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