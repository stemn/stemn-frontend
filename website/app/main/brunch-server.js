const express = require('express');
const http = require('http');
const Path = require('path');
const request = require('request-promise');

// Our server start function
module.exports = (port, path, callback) => {

    const app = express();
    const server = http.createServer(app);

    // for any api calls, proxy them to the api server on port 3000
    app.use((req, res, next) => {
        if (/^\/api\/v1/.test(req.originalUrl)) {
            request({
                method : req.method.toLowerCase(),
                headers : req.headers,
                url : `http://localhost:3000${req.originalUrl}`,
                json : true
            })
            .then((response) => res.json(response))
            .catch((response) => res.status(response.statusCode).json(response.error));
        } else {
            next();
        }
    })

    // serve static brunch content
    app.use(express.static(Path.join(__dirname, path)));

    // for all other cases, return index.html for in-app route handling
    app.use('/*', (req, res) => res.sendFile(Path.join(__dirname, './public/index.html')));

    // Listen on the right port, and notify Brunch once ready through `callback`.
    server.listen(port, callback);

    return server;
}
