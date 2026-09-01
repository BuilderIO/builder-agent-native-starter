import "dotenv/config";
import { createDrizzleConfig } from "@agent-native/core/db/drizzle-config";

// drizzle-kit runs DDL, which has to go to Neon's direct endpoint. The pooled
// DATABASE_URL is PgBouncer in transaction mode and breaks migrations.
if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
}

// `out` and `dialect` are load-bearing. This starter keeps app tables in
// `drizzle/schema.ts` and their journal in `drizzle/migrations`; dropping
// either option sends drizzle-kit to the framework defaults instead
// (`server/db/migrations`, dialect guessed from DATABASE_URL).
export default createDrizzleConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
});
