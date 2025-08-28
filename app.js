// app.js — run the prebuilt standalone Next.js server
const path = require('path');
process.env.PORT = process.env.PORT || '3000'; // Passenger sets this
require(path.join(__dirname, 'apps/web/.next/standalone/apps/web/server.js'));
