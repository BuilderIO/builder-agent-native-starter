# Fusion starter patch

This directory lives on the `template` branch only. Agent Native still
mirrors a pristine `templates/chat` tree onto `template` (rsync excludes
`.github/`); this overlay is applied while merging `template` into `main`,
so Fusion clones a thinner English-only canvas without changing the upstream
chat template.

`sync.yml` archives the pristine `origin/template` tree before the merge. The
patcher restores every path in the append-only `owned.txt` manifest from that
archive before applying the current replacements, overlay, and deletions. This
prevents prior patch output from accumulating or blocking a changed patch.

## What it does

- Replaces the chat-first homepage with a blank **Your app here** canvas
- Ships a clean app shell with no chat or agent rail by default (agent surfaces
  are opt-in; the shell still meets the Agent-Native contract)
- Ships an impress-by-default `DESIGN.md` and de-brands the design skill so
  generated apps look polished even with no design brief
- Replaces the `CLAUDE.md` symlink with a one-line pointer to `AGENTS.md` so
  agents that read both don't ingest the guide twice
- Trims agent-authoring skills that are dead weight inside a generated app
  (`turn-into-app`, `turn-into-skill`, `workspace-conventions`)
- Disables opt-in default plugins in `agent-native.json`
  (`integrations`, `observational-memory`, `sentry`, `terminal`) so a blank app
  doesn't boot Slack/Telegram/etc routes, error tracking, or the PTY terminal
- Strips i18n catalogs, language pickers, changelog, and What's New
- Adds Drizzle discovery files without touching private `drizzle/schema.ts`
- Re-adds Fusion-managed Drizzle deps/scripts (`drizzle-orm`, `drizzle-kit`,
  `db:generate`, `db:migrate`, `dotenv`, `@neondatabase/serverless`) that the
  chat template does not ship, plus the hosted `db:migrate` step in
  `netlify.toml`. It also makes generated Drizzle migrations the sole app
  migration path and keeps `scripts/migrate-production.ts` framework-only. It
  also guards `scripts/migrate-production.ts` so it only runs as its own process
  (`pnpm migrate:production`): action auto-discovery mounts the script as a live
  route, and running its `finally { closeDbExec() }` in-process would tear down
  the shared connection pool and break every later request. The guard throws
  instead when the file is imported rather than run directly.
  These files are overlay-owned so template syncs cannot restore the conflicting
  app migration instructions or remove first-boot `db:migrate`.
- Excludes `@agent-native/*` from pnpm `minimumReleaseAge` so a same-day
  framework publish does not fail Fusion `pnpm install`
- Drops `--open` from the `dev` script so headless Fusion cloud environments
  don't throw `spawn xdg-open ENOENT` trying to auto-open a browser
- Tells agents to typecheck once per batch and skip i18n/changelog unless asked

## Apply

```bash
node .github/starter-patch/apply.mjs --root /path/to/tree
```

The sync workflow additionally passes `--source-root /path/to/pristine-template`
to migrate a previously patched `main` tree to the current patch definition.

The script fails if an expected snippet is missing (upstream copy drifted) or
if a stripped path is still present after apply.
