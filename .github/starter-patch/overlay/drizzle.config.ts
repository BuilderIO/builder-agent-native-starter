import "dotenv/config";
import { createDrizzleConfig } from "@agent-native/core/db/drizzle-config";

// `out`, `dialect`, and `url` are all load-bearing. This starter keeps app
// tables in `drizzle/schema.ts` and their journal in `drizzle/migrations`, and
// migration DDL has to reach Neon's direct endpoint, since the pooled
// DATABASE_URL is PgBouncer in transaction mode. Dropping any of them falls
// back to a framework default that is wrong here (`server/db/migrations`, a
// dialect guessed from DATABASE_URL, and the pooled connection).
export default createDrizzleConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  url: process.env.DATABASE_URL_UNPOOLED,
});
