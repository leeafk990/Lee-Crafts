const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // POST /contact — handle form submission
  if (req.method === 'POST' && req.url === '/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('\n\x1b[32m📬 New Client Enquiry\x1b[0m');
        console.log('\x1b[90m──────────────────────────────\x1b[0m');
        console.log(`\x1b[33m  Name    :\x1b[0m ${data.fname} ${data.lname}`);
        console.log(`\x1b[33m  Email   :\x1b[0m ${data.email}`);
        console.log(`\x1b[33m  Phone   :\x1b[0m ${data.phone || 'N/A'}`);
        console.log(`\x1b[33m  Company :\x1b[0m ${data.company || 'N/A'}`);
        console.log(`\x1b[33m  Budget  :\x1b[0m ${data.budget || 'N/A'}`);
        console.log(`\x1b[33m  Type    :\x1b[0m ${data.ptype}`);
        console.log(`\x1b[33m  Services:\x1b[0m ${(data.services || []).join(', ') || 'N/A'}`);
        console.log(`\x1b[33m  Message :\x1b[0m ${data.message}`);
        console.log('\x1b[90m──────────────────────────────\x1b[0m\n');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false }));
      }
    });
    return;
  }

  // Serve static files
  let urlPath = req.url.split('?')[0].split('#')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const fullPath = path.join(__dirname, urlPath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(__dirname, 'index.html'), (e2, idx) => {
        if (e2) { res.writeHead(500); res.end('Error'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(idx);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('\n\x1b[32m🏗️  ARCHFORM — Company Showcase\x1b[0m');
  console.log(`\x1b[36m   → http://localhost:${PORT}\x1b[0m`);
  console.log('\x1b[90m   → Press Ctrl+C to stop\x1b[0m\n');
});
