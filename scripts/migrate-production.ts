import { closeDbExec, withMigrationRuntime } from "@agent-native/core/db";
import { runFrameworkReleaseMigrations } from "@agent-native/core/server";
import { realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Release-time schema entrypoint.
 *
 * Every deploy runs this once, and request functions never touch schema. That
 * ordering is not an optimization: on serverless, "migrate on first use" means
 * migrate on EVERY cold start, and a production incident traced a multi-hour
 * outage to schema introspection running 4-6 times concurrently on the request
 * path.
 *
 * `withMigrationRuntime()` is load-bearing. The Netlify BUILD environment sets
 * NETLIFY=true, so this script looks like a serverless request to the guard in
 * `runMigrations` — it is allowed to migrate only because it claims duty here.
 * A release entrypoint that forgets the wrapper silently does nothing.
 *
 * This entrypoint owns framework tables only. App tables in a managed Drizzle
 * project are generated from `drizzle/schema.ts` and applied by `db:migrate`.
 */
async function main(): Promise<void> {
  await withMigrationRuntime(async () => {
    await runFrameworkReleaseMigrations(null);
  });
}

// Guard: closeDbExec() below tears down the shared database pool, so this
// script must run only as its own process (`pnpm migrate:production`). The
// framework's action auto-discovery would otherwise mount it as a live route
// and running the teardown in-process breaks every other request with "Cannot
// use a pool after calling end on the pool." Throw instead of tearing down a
// pool this process does not own.
function isProcessEntrypoint(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return (
      pathToFileURL(realpathSync(entry)).href ===
      pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href
    );
  } catch {
    return false;
  }
}

if (!isProcessEntrypoint()) {
  throw new Error(
    "scripts/migrate-production.ts must run as its own process " +
      "(pnpm migrate:production); it closes the shared database pool when it " +
      "finishes, so importing or invoking it in-process — e.g. via an " +
      "auto-discovered action route — would break every other request.",
  );
}

try {
  await main();
} finally {
  await closeDbExec();
}
