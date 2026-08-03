const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = __dirname;

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

// Map Jekyll permalinks to actual files
const ROUTES = {
    '/': '_pages/home.html',
    '/index.html': '_pages/home.html',
    '/teams': '_pages/teams.html',
    '/teams.html': '_pages/teams.html',
};

http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);

    // Check if it's a known Jekyll permalink route
    if (ROUTES[urlPath]) {
        const fp = path.join(DIR, ROUTES[urlPath]);
        fs.readFile(fp, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // Otherwise serve static files
    let file = urlPath === '/' ? '/index.html' : urlPath;
    const fp = path.join(DIR, file);

    fs.readFile(fp, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(file);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`Website running at http://localhost:${PORT}`);
});