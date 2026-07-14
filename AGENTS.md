# builder-agent-native-starter — Agent Guide

Starter is the minimal agent-native app template. Keep template-specific
instructions here tiny and move real app guidance into `.agents/skills/` as the
app grows.

## Core Rules

- Never hardcode API keys, tokens, webhook URLs, signing secrets, private Builder/internal data, customer data, or credential-looking literals. Use secrets/OAuth/runtime configuration and obvious placeholders in examples.
- Follow the root framework contract: data in SQL, actions first, application
  state for navigation/selection, and shared agent chat for AI work.
- Use actions for app operations and keep frontend/API parity.
- Keep the action surface small and orthogonal: every action is a tool in the
  model's context window, so prefer one CRUD-style `update` (patch of fields)
  over many per-field actions, reach for an existing generic query / escape
  hatch (`provider-api-*`, dev `db-query`) before minting a new read action,
  mark UI-only or programmatic actions `agentTool: false` to hide them from the
  model (distinct from `toolCallable: false`, which only gates the extension
  iframe), and delete or hide actions the UI no longer uses. See the `actions`
  skill.
- Keep database code provider-agnostic and additive.
- Use `view-screen` or application state when the active page/selection is
  unclear.
- For new features, update UI, actions, skills/instructions, and application
  state when applicable.

## Framework Docs Lookup

Version-matched Agent Native docs and source examples ship with the installed
`@agent-native/core` package.

- Use `pnpm action docs-search --query "<topic>"`, `pnpm action docs-search --slug <slug>`, or `pnpm action docs-search --list`.
- Use `pnpm action source-search --query "<pattern>"` or `pnpm action source-search --path <path>` when implementation examples matter.
- To bring this app current, run `pnpm dlx @agent-native/core@latest upgrade` or `pnpm exec agent-native upgrade`.

## Application State

- `navigation` should describe the current view and selected entity ids.
- `navigate` may be used to move the UI when the app supports it.

## Skills

Read the relevant skill in `.agents/skills/` before implementation.

| Skill | When to read |
| --- | --- |
| `agent-native-docs` | Before using Agent Native framework APIs, generated-app features, or package docs |
| `adding-a-feature` | Before adding any feature, integration, or capability |
| `actions` | Before creating or modifying action files or action-backed frontend data |
| `storing-data` | Before adding data models or reading/writing application data |
| `real-time-sync` | Before wiring UI data that must refresh after agent or action writes |
| `security` | Before touching user data, auth, external input, routes, or actions |
| `delegate-to-agent` | Before adding AI behavior or sending work to the agent chat |
| `frontend-design` | Before building or restyling UI |
| `shadcn-ui` | Before adding, updating, or debugging shadcn/ui components |
| `self-modifying-code` | Before editing source, components, styles, scripts, or config |
| `create-skill` | Before adding or changing app-specific skills |
| `capture-learnings` | Before recording user preferences or corrections |
| `agent-engines` | Before configuring or testing model providers |
| `inline-embeds` | Before rendering interactive previews inside agent chat |
| `internationalization` | Before adding or editing visible UI copy or formatting |
| `notifications` | Before surfacing alerts, progress, or completion messages |
| `progress` | Before adding progress reporting for longer tasks |
| `real-time-collab` | Before adding collaborative editing |
| `upgrade-agent-native` | Before updating Agent Native packages or fixing upgrade drift |
| `app-branding` | Before renaming or rebranding the app, or when you generate its title, theme, or icon while scaffolding from an initial prompt |
| `app-permissions` | Before enabling a browser capability (camera, mic, location, screen capture, clipboard, wake-lock) the app needs but that is blocked |
