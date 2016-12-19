require('es5-shim');
require('es7-shim').shim();

const express = require('express');
const http = require('http');
const Path = require('path');

// use bluebird as mongoose's internal promise library
require('mongoose').Promise = require('bluebird');

// Our server start function
module.exports = (port, path, callback) => {
    const app = express();
    const server = http.createServer(app);

    // use the stemn app for all calls that aren't brunch static content
    app.use(require('../../server/app/app.js'));

    // Listen on the right port, and notify Brunch once ready through `callback`.
    server.listen(port, callback);
}
