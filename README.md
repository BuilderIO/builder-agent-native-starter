# Builder Agent Native Starter

A clean, standalone Agent-Native starter app — the blank canvas Fusion uses when you pick **Agent-Native** as your project template.

> **Auto-generated repository.** This repo is regenerated from [`BuilderIO/agent-native`](https://github.com/BuilderIO/agent-native) → `templates/starter`. 

## Local development

**Prerequisites**

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/)

**Required setup (run once)** — install dependencies before starting the dev server:

```bash
pnpm install
```

**Start the dev server** — run after setup is complete:

```bash
pnpm dev   # http://localhost:8080
```

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server (`agent-native dev --open`) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm typecheck` | Typecheck |
| `pnpm action <name>` | Run an action from CLI |

In local development, the embedded agent uses your Claude Code or Codex CLI login, or reads `ANTHROPIC_API_KEY` from a `.env` file. When `DATABASE_URL` is unset, the app uses SQLite (stored under `data/`). See the [Getting Started guide](https://www.agent-native.com/docs/getting-started) for details.

## Fusion / cloud development

When this repo runs in [Builder Fusion](https://www.builder.io/c/docs/fusion-project-settings), a few platform defaults differ from local development.

### Lockfile

This repo does not commit `pnpm-lock.yaml`. The first `pnpm install` in a cloud workspace creates one on disk and pins resolved versions until you update dependencies again.

## What's included

This is a **minimal** Agent-Native scaffold — a blank app ready for your first route, workflow, or data model. Tell the agent what to build.

**Ships with:**

- **Agent sidebar** — chat panel in the app shell; home page prompt composer to kick off customization
- **Actions system** — starter actions (`hello`, `navigate`, `view-screen`, `run`) and agent chat server plugin
- **Auth scaffold** — Better Auth (login, signup, sessions, organizations)
- **Live sync** — UI auto-refreshes when the agent writes to the database
- **App shell UI** — sidebar, header, command menu, theme toggle, and shadcn/ui components
- **Framework admin routes** — Database, Team, Observability, Extensions
- **Agent instructions** — [`AGENTS.md`](AGENTS.md) and skills in [`.agents/skills/`](.agents/skills/)
- **Deploy preset** — Netlify configuration in [`netlify.toml`](netlify.toml)
