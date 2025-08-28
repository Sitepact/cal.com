// app.js — start the Cal.com Next.js app under Passenger
const { createServer } = require('http');
const next = require('next');

const app = next({ dev: false, dir: './apps/web' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000; // <-- important

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(PORT, '0.0.0.0', () => {
    console.log(`Cal.com running on ${PORT}`);
  });
});
