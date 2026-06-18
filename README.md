# Builder Agent Native Starter

A clean, standalone Agent-Native starter app — the blank canvas Fusion uses when you pick **Agent-Native** as your project template.

> **Auto-generated repository.** This repo is regenerated from [`BuilderIO/agent-native`](https://github.com/BuilderIO/agent-native) → `templates/starter`. 

## Local development

**Prerequisites**

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/)

**Required setup (run once)** — complete all three steps before starting the dev server (local or Fusion cloud):

```bash
# 1. Install dependencies
pnpm install

# 2. Pin @agent-native/core to npm latest (do not use pnpm update --latest on Fusion)
pnpm add @agent-native/core@$(npm view @agent-native/core version)

# 3. Skip login/signup in dev/preview (not for production)
echo 'AUTH_DISABLED=true' >> .env
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

### Updating `@agent-native/core`

Run the `pnpm add @agent-native/core@…` step from **Local development** above — do not use `pnpm update @agent-native/core --latest`. Fusion's pnpm supply-chain policies can block automatic resolution to the newest release and may stop at an older 0.51.x version even when npm's `latest` tag is newer (pnpm will print something like `(0.58.x is available)`).

Verify with `pnpm list @agent-native/core` and restart the dev server after updating.

### Lockfile

This repo does not commit `pnpm-lock.yaml`. The first `pnpm install` in a cloud workspace creates one on disk and pins resolved versions until you update dependencies again.

### Skip login in cloud dev

The `echo 'AUTH_DISABLED=true' >> .env` step in **Local development** skips login/signup for internal previews only — **not production**. You can also set it in Fusion **Project settings → Dev server → Environment variables**. Restart the dev server after changing env vars. See [`DEVELOPING.md`](DEVELOPING.md) for more detail.

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
