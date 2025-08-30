// app.js — start prebuilt Next server and hydrate env from .env.cpanel
const fs = require('fs');
const path = require('path');

// Load .env.cpanel (robust: strip BOM/CRLF; keep existing process.env values)
(function loadEnv() {
  const p = path.join(__dirname, '.env.cpanel');
  if (!fs.existsSync(p)) return;
  let txt = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''); // strip BOM
  txt.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) return;
    const key = m[1];
    let val = m[2];
    // drop surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  });

  // Helpful aliases Prisma/Cal.com sometimes expect
  if (!process.env.DIRECT_URL && process.env.DATABASE_DIRECT_URL) {
    process.env.DIRECT_URL = process.env.DATABASE_DIRECT_URL;
  }
  if (!process.env.DATABASE_URL && process.env.DATABASE_DIRECT_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_DIRECT_URL;
  }
})();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';

// Try both common standalone server paths
const candidates = [
  path.join(__dirname, 'apps/web/.next/standalone/server.js'),
  path.join(__dirname, 'apps/web/.next/standalone/apps/web/server.js'),
];

let started = false, lastErr;
for (const p of candidates) {
  try { require(p); started = true; break; }
  catch (e) { lastErr = e; }
}
if (!started) {
  console.error('Could not find standalone server.js in expected locations.');
  if (lastErr) console.error(lastErr);
  process.exit(1);
}
