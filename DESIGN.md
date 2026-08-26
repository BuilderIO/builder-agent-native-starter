# Visual Design Contract

This file records the app-specific visual decisions that subsequent work must
preserve. It is not a second copy of the design process: read
`.agents/skills/frontend-design/SKILL.md` and its
`references/visual-direction.md` for the decision rules, examples, and audit.

Before assuming the app is blank, inspect `app/routes/_index.tsx` and
`app/global.css`. Existing real content, tokens, type, and composition are the
current product direction; extend them additively unless the user asks for a
redesign. Fill in this contract during the first surface build and update it
only when the product direction intentionally changes.

## App direction

- Product mode: `operate` | `decide` | `read` | `persuade` | `explore`
- Audience and cadence:
- Visual world (name + the feeling it creates):
- Palette family + neutral undertone:
- Type treatment:
- Composition:
- Shape language:
- Signature anchor (the recognizable domain object, behavior, or artifact):
- Anti-references (defaults this app must not drift toward):

## Agent-native boundary

The shell follows the Agent-Native contract: data in SQL, actions as the
single source of truth, application state for navigation and selection, and
real-time sync. Chat and the agent rail are opt-in, not default. Build the
product UI first; when agent interaction is requested, follow
`agent-native-toolkit` and the Agent Surface And Page Boundaries section of
`frontend-design`.

## Structural guardrails

- Keep semantic token names and shared component seams intact; express the
  direction through token values, type, spacing, and composition.
- Density comes from data, not explanatory prose. Compare against real
  products in the chosen mode, not against the starter.
