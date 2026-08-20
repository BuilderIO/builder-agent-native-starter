/**
 * App tables live here. Read this file + `drizzle/crud-action-example.ts`
 * before exploring node_modules or running find/cat over the repo.
 *
 * Paths for this starter:
 * - Schema: `drizzle/schema.ts` (this file)
 * - DB client: `server/db.ts` → `getDb()`, `schema`
 * - Migrate: `pnpm db:generate` then `pnpm db:migrate`
 * - Actions: `actions/<name>.ts` (see the CRUD example next to this file)
 *
 * Uncomment (or copy) the example table below when you need a first domain
 * table, then generate + run a migration before calling actions that use it.
 */
import { pgTable } from "drizzle-orm/pg-core";

// Add tables for this project below.
//
// Example (uncomment when needed):
//
// import { boolean, text, timestamp } from "drizzle-orm/pg-core";
//
// export const notes = pgTable("notes", {
//   id: text("id").primaryKey(),
//   title: text("title").notNull(),
//   body: text("body").notNull().default(""),
//   archived: boolean("archived").notNull().default(false),
//   createdAt: timestamp("created_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
// });
