# Fusion starter patch

This directory lives on the `template` branch only. Agent Native still
mirrors a pristine `templates/chat` tree onto `template`; this overlay is
applied while merging `template` into `main`, so Fusion clones a thinner
English-only canvas without changing the upstream chat template.

## What it does

- Replaces the chat-first homepage with a blank **Your app here** canvas
- Keeps Agent Native chat as an always-open **Your agent here** right rail
- Strips i18n catalogs, language pickers, changelog, and What's New
- Adds Drizzle discovery files without touching private `drizzle/schema.ts`
- Tells agents to typecheck once per batch and skip i18n/changelog unless asked

## Apply

```bash
node .github/starter-patch/apply.mjs --root /path/to/tree
```

The script fails if an expected snippet is missing (upstream copy drifted) or
if a stripped path is still present after apply.