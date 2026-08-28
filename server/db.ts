<<<<<<< HEAD:server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "../drizzle/schema";

let dbInstance: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (dbInstance) {
    return dbInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize the database client");
  }

  dbInstance = drizzle(neon(databaseUrl), { schema });
  return dbInstance;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
=======
// App data layer — the DB client lives here.
//
// This starter ships without any tables, so the wiring is stubbed out. `getDb()`
// returns a Drizzle client bound to the app's `schema`. Enable it when you add
// your first table (see `drizzle/START_HERE.md`):
//
//   1. Define tables in `drizzle/schema.ts`.
//   2. Uncomment the lines below, run `pnpm db:generate`, then `pnpm db:migrate`
//      to apply the new migration. (drizzle-orm, drizzle-kit, drizzle.config.ts,
//      and the db:generate/db:migrate scripts already ship.)
//
// import { createGetDb } from "@agent-native/core/db";
// import * as schema from "../drizzle/schema";
//
// export const getDb = createGetDb(schema);
// export { schema };

export {};
>>>>>>> origin/template:.github/starter-patch/overlay/server/db.ts
