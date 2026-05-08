#!/usr/bin/env node
/**
 * Verifies that every dashboard route in src/routes/ either:
 *  - declares its own `pendingComponent` in createFileRoute(...), OR
 *  - is explicitly allow-listed to fall back to the global
 *    `defaultPendingComponent: DashboardSkeleton` configured in src/router.tsx.
 *
 * Exits with code 1 if any route is missing coverage.
 * Run via: node scripts/check-pending-components.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = "src/routes";
const ROUTER_FILE = "src/router.tsx";

// Routes that are intentionally allowed to use only the global fallback.
// __root.tsx is the shell and never shows a pending state itself.
const GLOBAL_FALLBACK_ALLOWLIST = new Set([
  "__root.tsx",
  // Settings sub-routes inherit the parent /settings layout's pendingComponent
  // and the global defaultPendingComponent, so they don't declare their own.
  "settings.index.tsx",
  "settings.platform.tsx",
  "settings.security.tsx",
  "settings.payments.tsx",
  "settings.sms.tsx",
  "settings.email.tsx",
  "settings.verification.tsx",
  "settings.commission.tsx",
  "settings.geo.tsx",
]);

function fail(msg) {
  console.error(`\u2717 ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`\u2713 ${msg}`);
}

// 1. Confirm router has a global defaultPendingComponent.
if (!existsSync(ROUTER_FILE)) {
  fail(`Missing ${ROUTER_FILE}`);
  process.exit(1);
}
const routerSrc = readFileSync(ROUTER_FILE, "utf8");
const hasGlobalFallback = /defaultPendingComponent\s*:/.test(routerSrc);
if (!hasGlobalFallback) {
  fail(`${ROUTER_FILE} does not set \`defaultPendingComponent\` — global skeleton fallback is missing.`);
} else {
  ok(`Global \`defaultPendingComponent\` is configured in ${ROUTER_FILE}.`);
}

// 2. Walk every .tsx route file.
const files = readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".tsx"));
if (files.length === 0) {
  fail(`No route files found in ${ROUTES_DIR}.`);
  process.exit(1);
}

let missing = [];
let covered = [];
let allowed = [];

for (const file of files) {
  const full = join(ROUTES_DIR, file);
  const src = readFileSync(full, "utf8");
  const hasOwn = /pendingComponent\s*:/.test(src);

  if (hasOwn) {
    covered.push(file);
  } else if (GLOBAL_FALLBACK_ALLOWLIST.has(file)) {
    allowed.push(file);
  } else {
    missing.push(file);
  }
}

console.log(`\nRoutes scanned: ${files.length}`);
console.log(`  with own pendingComponent: ${covered.length}`);
console.log(`  allow-listed for global fallback: ${allowed.length} (${[...allowed].join(", ") || "—"})`);
console.log(`  uncovered: ${missing.length}`);

if (missing.length > 0) {
  for (const f of missing) {
    fail(
      `${join(ROUTES_DIR, f)} has no \`pendingComponent\` and is not in GLOBAL_FALLBACK_ALLOWLIST. ` +
        `Either add a pendingComponent or add the file name to the allow-list in scripts/check-pending-components.mjs.`,
    );
  }
  if (!hasGlobalFallback) {
    fail("No global fallback either — navigation to these routes will show a blank screen.");
  }
}

if (process.exitCode) {
  console.error("\nPending-component check FAILED.");
} else {
  console.log("\nPending-component check passed.");
}
