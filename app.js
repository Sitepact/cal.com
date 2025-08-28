// app.js
const { createServer } = require('http');
const path = require('path');

let next;
try {
  next = require('next'); // works if hoisted to root
} catch {
  next = require(path.join(__dirname, 'apps/web/node_modules/next')); // fallback
}

const app = next({ dev: false, dir: './apps/web' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000; // Passenger sets this

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(PORT, '0.0.0.0', () => {
    console.log(`Cal.com running on ${PORT}`);
  });
});
