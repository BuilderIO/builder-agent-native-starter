# Data layer — start here

This file plus `drizzle/crud-action-example.ts` is all you need to add a table
and wire CRUD. You do **not** need the `storing-data`, `actions`, or
`agent-native-docs` skills for standard CRUD, and you do **not** need to search
`node_modules` or read any `dist/*.d.ts` to discover the API — the pattern is
already stubbed in the files below.

## The files are already here

| What | Path | State |
| --- | --- | --- |
| App tables | `drizzle/schema.ts` | Stub — add tables here |
| DB client | `server/db.ts` → `getDb()`, `schema` | Stub — uncomment to enable |
| CRUD pattern | `drizzle/crud-action-example.ts` | Copy into `actions/<name>.ts` |
| Actions | `actions/<name>.ts` | You create these |

Open `server/db.ts` and `drizzle/schema.ts` and edit them in place. Do **not**
`find` / `cat` over `node_modules/@agent-native` or `drizzle-orm`, and do **not**
read `dist/*.d.ts` — everything you need is in the two stub files.

## Enable the data layer (once)

1. Add a table to `drizzle/schema.ts` (an example is commented in the file).
2. Uncomment the wiring in `server/db.ts`.
3. Add the tooling this starter omits until data is needed:
   - `drizzle-orm` (dependency) and `drizzle-kit` (devDependency)
   - a `"db:generate": "drizzle-kit generate"` script in `package.json`
   - `drizzle.config.ts` with `export default createDrizzleConfig()` from
     `@agent-native/core/db/drizzle-config`
4. Run `pnpm db:generate`, then restart the dev server — the framework applies
   pending migrations on boot.
5. Copy the CRUD pattern from `drizzle/crud-action-example.ts` into
   `actions/<name>.ts`.

## After a batch of schema/action edits

One smoke path (create + list), then one `pnpm typecheck`. See
`self-modifying-code`.
