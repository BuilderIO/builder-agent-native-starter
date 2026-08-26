# Data layer — start here

Read this file and `drizzle/crud-action-example.ts` before searching
`node_modules` or grepping the repo for SQL helpers.

## Paths in this starter

| What | Path |
| --- | --- |
| App tables | `drizzle/schema.ts` |
| DB client | `server/db.ts` → `getDb()`, `schema` |
| Migrations | `pnpm db:generate` then `pnpm db:migrate` |
| Actions | `actions/<name>.ts` |

Do not start with `find` / `cat` over `node_modules/@agent-native` or
`drizzle-orm` to discover how to add a table. Add columns/tables in
`drizzle/schema.ts`, generate a migration, then copy the CRUD pattern from
`drizzle/crud-action-example.ts`.

## After a batch of schema/action edits

One smoke path (create + list), then one `pnpm typecheck`. See
`self-modifying-code`.
