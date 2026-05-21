import { readFileSync } from "node:fs";

const workerPath = "src/worker.js";
const protocolPath = "docs/planning/WORKER_NATIVE_COMMAND_PROTOCOL.md";

const worker = readFileSync(workerPath, "utf8");
const protocol = readFileSync(protocolPath, "utf8");

const exactPaths = [...worker.matchAll(/url\.pathname\s*===\s*"([^"]+)"/g)].map((match) => match[1]);
const prefixPaths = [...worker.matchAll(/url\.pathname\.startsWith\("([^"]+)"\)/g)].map((match) => `${match[1]}*`);
const endpoints = [...new Set([...exactPaths, ...prefixPaths].filter((path) => path.startsWith("/api/")))].sort();

const ignoredPrefixes = ["/api/*"];
const documented = endpoints.filter((endpoint) => {
  if (ignoredPrefixes.includes(endpoint)) return true;
  const literal = endpoint.replace(/\*$/, "");
  return protocol.includes(endpoint) || protocol.includes(literal);
});

const missing = endpoints.filter((endpoint) => !documented.includes(endpoint));
if (missing.length > 0) {
  console.error(`Missing Worker command protocol documentation for ${missing.length} endpoint(s):`);
  for (const endpoint of missing) console.error(`- ${endpoint}`);
  process.exit(1);
}

const requiredTerms = [
  "sa-worker-command-v1",
  "requestId",
  "sessionId",
  "saveVersion",
  "room.mapPresence",
  "deterministic",
  "old native TCP compatibility is a later gateway track"
];

const missingTerms = requiredTerms.filter((term) => !protocol.includes(term));
if (missingTerms.length > 0) {
  console.error("Worker command protocol is missing required contract terms:");
  for (const term of missingTerms) console.error(`- ${term}`);
  process.exit(1);
}

console.log(`Worker command protocol documents ${documented.length} endpoint(s).`);
