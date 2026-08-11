# Chat — Agent Guide

Chat is the minimal chat-first agent-native app. Chat is the primary surface;
actions carry the real capabilities, and screens exist only where a workflow
needs durable UI around the conversation.

## Skills

- `capture-learnings` — record a user preference or correction so it outlives
  the thread.
- `turn-into-app` — promote a recurring workflow in this chat into its own app.
- `turn-into-skill` — promote a repeated procedure into a reusable skill.
- `docs-search` reads the version-matched framework docs bundled with
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
<<<<<<< HEAD
- Never hardcode API keys, tokens, webhook URLs, signing secrets, private Builder/internal data, customer data, or credential-looking literals. Use secrets/OAuth/runtime configuration and obvious placeholders in examples.
- Follow the root framework contract: data in SQL, actions first, application
  state for navigation/selection, and shared agent chat for AI work.
- Keep actions deterministic and focused. For research, analysis, generation,
  recommendation, or synthesis, start in the AgentSidebar and let the agent
  orchestrate its tools; keep follow-ups in the same thread instead of adding
  a second freeform prompt box.
- Keep the full-page chat route distinct from domain pages. If a workflow needs
  a page, give it a named route and use the right AgentSidebar for contextual
  AI; domain buttons that call `sendToAgentChat()` should open that sidebar.
- Keep the first viewport sparse and task-focused. Use progressive disclosure
  and domain-specific navigation, and never use sparkle, wand, magic, or robot
  icons as AI affordances.
- Page and section data loads use layout-matching `Skeleton` geometry, never a
  generic "Loading..." label. Reserve `Spinner` for brief mutations, uploads,
  and progress actions.
- Use a sans-first SaaS hierarchy with one restrained visual cue; reserve serif
  type for content previews. Give the AgentSidebar a subtle surface/divider
  boundary, and stack original/generated review vertically by default.
- Before visual work, read `frontend-design` and fill in `DESIGN.md`. Choose a
  product-fitting visual direction and palette family; do not make warm beige
  plus terracotta the default or copy a sibling app's accent automatically.
- Every AI-labeled button must call `sendToAgentChat()` with
  `openSidebar: true`; label deterministic local actions as local or preview.
- Scale effort to the task. A small, well-specified change is a short read, the
  edit, and the app's existing checks (`pnpm typecheck`, formatter, existing
  tests) — not a codebase survey, unrequested tests, or browser automation.
- Use actions for app operations and keep frontend/API parity.
- Do not add `/api/*` routes for app data. If you are about to create a file
  under `server/routes/api/`, or middleware to guard one, stop and write a
  `defineAction` instead. The only exceptions are uploads, streaming, inbound
  webhooks, OAuth callbacks, public unauthenticated URLs, and non-JSON
  responses — not auth, settings, search, or CRUD.
- Treat the chat as the default UI. When the user asks for a capability, prefer
  adding or improving the action surface first, then add a page, table, form, or
  widget only when the user needs to inspect, compare, approve, or share durable
  objects.
- If the user wants to plug in their own agent backend, keep the app shell and
  thread UI intact and adapt the chat through the framework's `AgentChatRuntime`
  connector helpers instead of forking the transcript/composer UI.
- Keep the action surface small and orthogonal: every action is a tool in the
  model's context window, so prefer one CRUD-style `update` (patch of fields)
  over many per-field actions, reach for an existing generic query / escape
  hatch (`provider-api-*`, dev `db-query`) before minting a new read action,
  mark UI-only or programmatic actions `agentTool: false` to hide them from the
  model (distinct from `toolCallable: false`, which only gates the extension
  iframe), and delete or hide actions the UI no longer uses. See the `actions`
  skill.
- Keep database code provider-agnostic and additive.
=======
- Never hardcode API keys, tokens, webhook URLs, signing secrets, private
  Builder/internal data, customer data, or credential-looking literals. Use
  secrets/OAuth/runtime configuration and obvious placeholders in examples.
- Keep actions deterministic and focused. Research, analysis, generation,
  recommendation, and synthesis start in the AgentSidebar and let the agent
  orchestrate its tools; follow-ups stay in the same thread rather than moving
  the user to a second freeform prompt box.
- Never fabricate. If an action fails or data is missing, say so and recover
  instead of inventing a result or claiming success.
- Verify a write before reporting it done — re-read the row or the screen.
>>>>>>> origin/template
- Use `view-screen` or application state when the active page/selection is
  unclear.

## Application State

- `navigation` describes the current view and selected entity ids. The default
  chat view is `chat` at `/`.
- `navigate` moves the UI when the app supports it.
- `view-screen` is the first tool to call when the user's visible context
  matters.

## Source Changes

Before building common workspace or agent UI, read `agent-native-toolkit`; read
`customizing-agent-native` before adapting shared UI.

<<<<<<< HEAD
## Skills

Read the relevant root skill before implementation: `adding-a-feature`,
`actions`, `agent-native-docs`, `agent-native-toolkit`,
`customizing-agent-native`, `storing-data`,
`real-time-sync`, `security`, `delegate-to-agent`, `frontend-design`, `shadcn-ui`, and
`self-modifying-code`.

=======
>>>>>>> origin/template
- Guarded verification: run `pnpm agent-native:doctor`; fix findings before done.
