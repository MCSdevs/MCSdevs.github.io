var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript',
    json: 'application/json'
};
var send_file = function (filename, res) {
    var type = mime[path.extname(filename).slice(1)] || 'text/plain';
    var s = fs.createReadStream(filename);
    s.on('open', function () {
        res.setHeader('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
};
var server = http.createServer(function (req, res) {
    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }
    switch (req.url) {
        case "/": return send_file("./index.html", res);
        case "/assets/icon.png": return send_file("./assets/icon.png", res);
        default:
            res.statusCode = 404;
            return res.end('<h1 style="text-align:center;padding:100px;">404 Page not found</h1>');
    }
});
