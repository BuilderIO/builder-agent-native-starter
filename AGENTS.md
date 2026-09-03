# App — Agent Guide

This starter ships as a blank Agent-Native app canvas — that describes its
initial state, not necessarily its current one. Before assuming no UI or
brand exists, check `app/routes/_index.tsx` and `app/global.css`: if they
already contain real content, that content is the current product and its
established brand. Build additively, preserve existing tokens/routes/palette,
and do not re-derive a new visual direction or overwrite shipped UI unless
the user explicitly asks for a redesign. Only treat the canvas as blank when
the files actually show the starter's placeholder content.

## Skills

The default app skill surface is intentionally small. Promotion, learning,
translation, changelog, provider, and release workflows are optional; enable
the matching skill only when this app actually uses that workflow.

**Do not add internationalization or changelog support unless the user
explicitly asks for them.** This starter ships English-only UI copy inline —
no `app/i18n/`, LanguagePicker, `CHANGELOG.md`, or What's New surfaces. If the
user requests i18n or changelogs, load the matching skill and add only what they
asked for. The
`docs-search` action reads the version-matched framework docs bundled with
  `@agent-native/core`; `source-search` reads core and first-party template
  implementations. Prefer both over memory when package APIs, actions, or agent
  surfaces are involved.

## Core Rules

- Follow the root framework contract: data in SQL, actions first, application
  state for navigation/selection, and shared agent chat for AI work.
- Store large file/blob payloads in configured file/blob storage, not SQL: no
  base64, `data:` URLs, images, video/audio, PDFs, ZIPs, screenshots,
  thumbnails, or replay chunks in app tables, `application_state`, `settings`,
  or `resources`; persist URLs, ids, or handles instead.
- Never hardcode API keys, tokens, webhook URLs, signing secrets, private
  Builder/internal data, customer data, or credential-looking literals. Use
  secrets/OAuth/runtime configuration and obvious placeholders in examples.
- For external integrations, inspect the workspace/provider connection catalog
  first. Reuse an existing connection and its scoped credential resolver; only
  use app-local vault/OAuth/settings primitives when no reusable connection
  exists. Keep custom setup UI provider-specific and never duplicate storage.
- Keep actions deterministic and focused. Research, analysis, generation,
  recommendation, and synthesis start in the AgentSidebar and let the agent
  orchestrate its tools; follow-ups stay in the same thread rather than moving
  the user to a second freeform prompt box.
- Never fabricate. If an action fails or data is missing, say so and recover
  instead of inventing a result or claiming success.
- Verify a write before reporting it done — re-read the row or the screen.
- Use `view-screen` or application state when the active page/selection is
  unclear.

For a custom app, keep `server/plugins/config.ts` aligned with the product
brand. Its `app.name` is used in transactional emails, and its optional
`app.logoUrl` can point to an absolute HTTPS logo URL.

## Application State

- `navigation` describes the current view and selected entity ids. The default
  home view is `home` at `/` (blank app canvas). No agent rail or chat is
  mounted by default; add one only when the user asks.
- `navigate` moves the UI when the app supports it.
- `view-screen` is the first tool to call when the user's visible context
  matters.

## Source Changes

Before building common workspace or agent UI, read `agent-native-toolkit`; read
`customizing-agent-native` before adapting shared UI.

## Data & actions (read these first)

Add persistence or auth **only when data must survive reload or be shared
between users**. A pure UI, copy, or layout change needs no schema, action, or
auth — build it directly and do **not** read the `security` or `storing-data`
skills for UI-only work. Only when you actually add an action, route, or schema
that handles user input or persistence, read `security` and `storing-data`
first.

### Choose the post-auth landing route from the app

Before enabling authentication, inspect `app/routes`, the app's navigation,
and any existing `app.homePath` in `server/plugins/config.ts`. Preserve an
existing `homePath` when it still points to a valid route. Otherwise choose
the actual primary authenticated landing page from the product already built,
such as `/`, `/dashboard`, or `/tasks`. Never assume `/home` unless that
route really exists.

Do not choose an auth route, API route, public-only marketing page, wildcard
route, or parameterized route that cannot open without an id. If multiple
authenticated landing routes are equally plausible and the product intent is
unclear, ask the user instead of inventing one.

Write the selected route to the existing `defineAppConfig` object in
`server/plugins/config.ts` while preserving its `plugins.disabled` settings:

```ts
export default defineAppConfig({
  app: { homePath: "/dashboard" },
  plugins: {
    disabled: ["integrations", "observational-memory", "sentry", "terminal"],
  },
});
```

After enabling or changing auth, verify both signup and login land on an
existing page rather than a 404.

When adding SQL-backed features, do **not** start with `find` / `cat` over
`node_modules`. Read these two files first:

1. `drizzle/START_HERE.md` — table map, migrate commands, path map
2. `drizzle/crud-action-example.ts` — copy-paste list/create/update/delete

Then use `getDb` / `schema` from `server/db.ts`. After a batch of related
schema/action edits: one smoke test, one `pnpm typecheck` (see
`self-modifying-code`).

- Guarded verification: run `pnpm agent-native:doctor`; fix findings before done.
- For ordinary source edits, follow `self-modifying-code`: verify once per batch,
  not after every file; smoke-test new CRUD once, don't CLI-test every action.

## Configuration is code, not env vars

Configure framework behavior in `agent-native.config.ts` via
`defineAgentNativeConfig({ ... })`. App metadata consumed by `getAppConfig()`,
including `app.homePath`, belongs in the existing `defineAppConfig` object in
`server/plugins/config.ts`. Do **not** reach for `process.env` to drive app
behavior, feature flags, or framework options. Environment variables are only
for deploy-level secrets and host settings (see `secrets`); never add a
`process.env` fallback to configure a feature.
