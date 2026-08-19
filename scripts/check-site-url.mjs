const raw = process.env.SITE_URL?.trim();
if (!raw) throw new Error("SITE_URL is required for a production release check.");

const url = new URL(raw);
const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
if (localHosts.has(url.hostname)) throw new Error(`SITE_URL must not use a local host: ${url.hostname}`);
if (url.protocol !== "https:") throw new Error("SITE_URL must use HTTPS for formal publishing.");

console.log(`Production SITE_URL verified: ${url.origin}`);
