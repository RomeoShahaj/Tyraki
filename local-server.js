const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Import API handlers
const analyzeHandler = require('./api/analyze-local.js');
const checkoutHandler = require('./api/create-checkout.js');
const verifyHandler = require('./api/verify-payment.js');

// Wrap response to make it compatible with Vercel API
function wrapResponse(res) {
  res.status = function(code) {
    res.statusCode = code;
    return this;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return this;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Wrap response for API compatibility
  wrapResponse(res);

  // Handle API routes
  if (req.url === '/api/analyze') {
    return analyzeHandler(req, res);
  }

  if (req.url === '/api/create-checkout') {
    return checkoutHandler(req, res);
  }

  if (req.url === '/api/verify-payment') {
    return verifyHandler(req, res);
  }

  // Serve static files
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Local server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from ${__dirname}`);
  console.log(`\n✨ Ready to test with bank statements!\n`);
});
