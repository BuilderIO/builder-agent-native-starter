# Fusion starter patch

This directory lives on the `template` branch only. Agent Native still
mirrors a pristine `templates/chat` tree onto `template` (rsync excludes
`.github/`); this overlay is applied while merging `template` into `main`,
so Fusion clones a thinner English-only canvas without changing the upstream
chat template.

`sync.yml` archives `.github/starter-patch` from the `origin/template` ref
*before* the merge. It cannot copy from the post-merge working tree: after the
first successful sync, main's merge commit has template as a parent but omits
this directory, so Git would treat an unchanged overlay as a deletion on the
next run.

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
- Tells agents to typecheck once per batch and skip i18n/changelog unless asked

## Apply

```bash
node .github/starter-patch/apply.mjs --root /path/to/tree
```

The script fails if an expected snippet is missing (upstream copy drifted) or
if a stripped path is still present after apply.