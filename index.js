//Express
const express = require('express');
const app = express();
const path = require('path');
const logger = require('./logger.js');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const user_endpoints = require('./api/user/user_endpoints.js');
const admin_endpoints = require('./api/admin/admin_endpoints.js');
const provider_endpoints = require('./api/provider/provider_endpoints.js');

const PORT = 3000;
//bodyparser
const bodyParser = require('body-parser');
const db = require('./connection.js');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client')));
app.use('/api/user', user_endpoints);
app.use('/api/admin', admin_endpoints);
app.use('/api/provider', provider_endpoints);

app.listen(PORT, () => {
    logger.log(logger.LOGTYPE.INFO, `Server running on port ${PORT}`);
});
