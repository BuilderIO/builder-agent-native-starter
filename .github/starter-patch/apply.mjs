#!/usr/bin/env node
/**
 * Apply the Fusion starter overlay onto a materialized chat template tree.
 *
 * Owned by the `template` branch. The sync workflow copies this directory aside
 * before dropping `.github/`, then runs it against the merged `main` tree.
 * Search/replace steps fail loudly if upstream copy drifted.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_DIR = path.dirname(fileURLToPath(import.meta.url));
const OVERLAY_DIR = path.join(PATCH_DIR, "overlay");

function parseArgs(argv) {
  let root = process.cwd();
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--root" && argv[i + 1]) {
      root = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return { root };
}

function readLines(file) {
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function listOverlayFiles() {
  const files = [];
  function walk(rel) {
    const abs = path.join(OVERLAY_DIR, rel);
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      const next = path.join(rel, entry.name);
      if (entry.isDirectory()) walk(next);
      else files.push(next.split(path.sep).join("/"));
    }
  }
  walk(".");
  return files;
}

function uniqueReplace(file, from, to) {
  if (!existsSync(file)) {
    throw new Error(`replacement target missing: ${relTo(file)}`);
  }
  const src = readFileSync(file, "utf8");
  const count = src.split(from).length - 1;
  if (count === 0) {
    throw new Error(
      `starter patch failed: expected snippet not found in ${relTo(file)}\n---\n${from}\n---`,
    );
  }
  if (count !== 1) {
    throw new Error(
      `starter patch failed: snippet not unique (${count}x) in ${relTo(file)}`,
    );
  }
  writeFileSync(file, src.replace(from, to));
}

function optionalReplace(file, from, to) {
  if (!existsSync(file)) return;
  uniqueReplace(file, from, to);
}

function relTo(file) {
  return path.relative(process.cwd(), file) || file;
}

function copyOverlay(root) {
  if (!existsSync(OVERLAY_DIR)) {
    throw new Error(`missing overlay directory: ${OVERLAY_DIR}`);
  }
  const files = listOverlayFiles();
  if (files.length === 0) {
    throw new Error("starter patch overlay is empty");
  }
  for (const rel of files) {
    const to = path.join(root, rel);
    mkdirSync(path.dirname(to), { recursive: true });
    cpSync(path.join(OVERLAY_DIR, rel), to);
  }
  return files;
}

function deleteListed(root) {
  for (const rel of readLines(path.join(PATCH_DIR, "delete.txt"))) {
    const target = path.join(root, rel);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
}

function assertGone(root, rel, label) {
  if (existsSync(path.join(root, rel))) {
    throw new Error(`${label} still present at ${rel}`);
  }
}

function assertContains(root, rel, snippet) {
  const file = path.join(root, rel);
  if (!existsSync(file)) throw new Error(`expected ${rel} after patch`);
  const src = readFileSync(file, "utf8");
  if (!src.includes(snippet)) {
    throw new Error(`expected ${rel} to contain:\n${snippet}`);
  }
}

function assertHomepageShape(root) {
  const src = readFileSync(path.join(root, "app/routes/_index.tsx"), "utf8");
  if (!/return \(\r?\n\s*<div[\s>]/.test(src)) {
    throw new Error(
      "app/routes/_index.tsx must use `return (\\n    <div` so Fusion can inject its generating placeholder",
    );
  }
  if (!src.includes("Your app here")) {
    throw new Error("homepage is missing the replaceable Your app here canvas");
  }
}

function applyReplacements(root) {
  uniqueReplace(
    path.join(root, "AGENTS.md"),
    `Chat is the minimal chat-first agent-native app. Chat is the primary surface;
actions carry the real capabilities, and screens exist only where a workflow
needs durable UI around the conversation.`,
    `This starter is a blank app canvas with a built-in agent rail. Put product UI
in the left canvas ("Your app here"); the right rail is the agent ("Your agent
here"). Actions carry the real capabilities.`,
  );

  uniqueReplace(
    path.join(root, "AGENTS.md"),
    `The default app skill surface is intentionally small. Promotion, learning,
translation, changelog, provider, and release workflows are optional; enable
the matching skill only when this app actually uses that workflow.`,
    `The default app skill surface is intentionally small. Promotion, learning,
translation, changelog, provider, and release workflows are optional; enable
the matching skill only when this app actually uses that workflow.

**Do not add internationalization or changelog support unless the user
explicitly asks for them.** This starter ships English-only UI copy inline —
no \`app/i18n/\`, LanguagePicker, \`CHANGELOG.md\`, or What's New surfaces. If the
user requests i18n or changelogs, load the matching skill and add only what they
asked for.`,
  );

  uniqueReplace(
    path.join(root, "AGENTS.md"),
    `- \`navigation\` describes the current view and selected entity ids. The default
  chat view is \`chat\` at \`/\`.`,
    `- \`navigation\` describes the current view and selected entity ids. The default
  home view is \`home\` at \`/\` (blank app canvas). Agent chat lives in the right
  rail, not on the homepage.`,
  );

  uniqueReplace(
    path.join(root, "AGENTS.md"),
    `Before building common workspace or agent UI, read \`agent-native-toolkit\`; read
\`customizing-agent-native\` before adapting shared UI.

- Guarded verification: run \`pnpm agent-native:doctor\`; fix findings before done.`,
    `Before building common workspace or agent UI, read \`agent-native-toolkit\`; read
\`customizing-agent-native\` before adapting shared UI.

## Data & actions (read these first)

When adding SQL-backed features, do **not** start with \`find\` / \`cat\` over
\`node_modules\`. Read these two files first:

1. \`drizzle/START_HERE.md\` — table map, migrate commands, path map
2. \`drizzle/crud-action-example.ts\` — copy-paste list/create/update/delete

Then use \`getDb\` / \`schema\` from \`server/db.ts\`. After a batch of related
schema/action edits: one smoke test, one \`pnpm typecheck\` (see
\`self-modifying-code\`).

- Guarded verification: run \`pnpm agent-native:doctor\`; fix findings before done.
- For ordinary source edits, follow \`self-modifying-code\`: verify once per batch,
  not after every file; smoke-test new CRUD once, don't CLI-test every action.`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/self-modifying-code/SKILL.md"),
    `| 2: Source     | App code              | Components, routes, styles, scripts              | Run \`pnpm typecheck && pnpm lint\` |`,
    `| 2: Source     | App code              | Components, routes, styles, scripts              | Verify **once per batch** (see Verification below) |`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/self-modifying-code/SKILL.md"),
    `1. Commit or stash current state
2. Make the edit
3. Run \`pnpm typecheck && pnpm lint\`
4. If verification fails → revert with \`git checkout -- <file>\`
5. If verification passes → continue`,
    `1. Commit or stash current state
2. Make the full batch of related edits
3. Verify once (see Verification)
4. If verification fails → revert with \`git checkout -- <file>\`
5. If verification passes → continue

## Verification

Run checks **once at the end of a batch of related edits**, not after every
file, action, or small UI tweak. Dev already runs route/action typegen while
\`pnpm dev\` is up — do not treat that as a reason to also run full typecheck
after each write.

| Change shape | Verify with |
| ------------- | ----------- |
| UI / copy / layout only | Formatter if the app has one; preview if something looks wrong. Skip full typecheck unless the edit touched types or imports. |
| New/changed actions, schema, server, or shared types | One \`pnpm typecheck\` (and lint if the app has it) after the batch. |
| New DB-backed CRUD | One smoke path only (e.g. create + list via \`pnpm action …\` or a single HTTP call). Do **not** CLI-test every action method. |

Do not re-run typecheck to "confirm" after a clean pass. If typecheck fails on
unrelated pre-existing errors, fix or note them — do not thrash with repeated
full runs and greps.`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/self-modifying-code/SKILL.md"),
    `**Keep localized copy in catalogs** — When editing visible UI copy, labels,
toasts, empty states, prompts, or formatting, update the English source catalog.
Read the optional \`internationalization\` skill and update additional catalogs
only when \`translations.locales\` in \`agent-native.config.ts\` includes them.`,
    `**Keep UI copy inline (English)** — Edit visible labels, toasts, empty states,
and prompts as plain strings in components. Do **not** introduce i18n catalogs,
\`useT()\`, or a LanguagePicker unless the user explicitly asks for localization.
If they do, read the \`internationalization\` skill and add catalogs then.`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/self-modifying-code/SKILL.md"),
    `- Don't skip the typecheck/lint step after editing source code`,
    `- Don't skip end-of-batch verification for Tier 2 changes that touch types,
  actions, schema, or server code
- Don't run \`pnpm typecheck\` or smoke-test every action after each file write`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/adding-a-feature/SKILL.md"),
    `If the feature adds or changes visible UI copy, prompts, toasts, labels, empty
states, or formatting, update the English source copy. Read the optional
\`internationalization\` skill and update additional catalogs only when
\`translations.locales\` in \`agent-native.config.ts\` includes them.`,
    `If the feature adds or changes visible UI copy, prompts, toasts, labels, empty
states, or formatting, edit the English strings inline in components. Do **not**
add i18n catalogs unless the user explicitly asks for localization; only then
read the \`internationalization\` skill.`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/actions/SKILL.md"),
    `The default template dispatches through core's \`runScript()\` in \`actions/run.ts\`. Action names are lowercase-with-hyphens (\`pnpm action my-action\` → \`actions/my-action.ts\`).

## Custom \`/api/\` Routes`,
    `The default template dispatches through core's \`runScript()\` in \`actions/run.ts\`. Action names are lowercase-with-hyphens (\`pnpm action my-action\` → \`actions/my-action.ts\`).

After adding or changing several related actions, smoke-test **once** (one
happy-path call that proves the wire-up), then typecheck once. Do not run
\`pnpm action …\` for every method unless a smoke test failed and you need to
isolate which action broke.

## CRUD + Drizzle in this starter

Before hunting through \`node_modules\` for DB helpers, read:

1. \`drizzle/START_HERE.md\` — where tables live + migrate commands
2. \`drizzle/crud-action-example.ts\` — copy-paste list/create/update/delete pattern

DB client: \`getDb\` / \`schema\` from \`server/db.ts\`.

## Custom \`/api/\` Routes`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/frontend-design/SKILL.md"),
    `Match verification effort to the size of the change. For one component, one
form, one page, or a restyle, run the app's existing checks — formatter,
\`pnpm typecheck\`, existing tests — and stop there.`,
    `Match verification effort to the size of the change. For one component, one
form, one page, or a restyle, run the app's existing checks **once at the end of
the batch** — formatter, and \`pnpm typecheck\` only if types/imports changed —
then stop. Do not typecheck after every file write.`,
  );

  uniqueReplace(
    path.join(root, ".agents/skills/agent-native-toolkit/SKILL.md"),
    `- **Settings kit**: a searchable settings page with account, workspace, AI
  models, LLM keys, connections, secrets, usage, notifications, changelog, and
  app-specific panels. Search is on by default; register a \`SettingsSearchEntry\`
  per control so users find settings by name across tabs.`,
    `- **Settings kit**: a searchable settings page with account, workspace, AI
  models, LLM keys, connections, secrets, usage, notifications, and
  app-specific panels. Changelog / What's New is optional — only add it when
  the user explicitly asks. Search is on by default; register a
  \`SettingsSearchEntry\` per control so users find settings by name across tabs.`,
  );

  optionalReplace(
    path.join(root, ".agents/skills/app-branding/SKILL.md"),
    `- \`pnpm typecheck\` passes.`,
    `- \`pnpm typecheck\` passes once at the end of the branding batch (skip if only
  CSS/copy tokens changed with no type/import edits).`,
  );

  optionalReplace(
    path.join(root, ".agents/skills/app-permissions/SKILL.md"),
    `4. **Typecheck.** Editing server source is a Tier 2 change — run \`pnpm typecheck\`
   afterward (see \`self-modifying-code\`).`,
    `4. **Typecheck.** Editing server source is a Tier 2 change — run \`pnpm typecheck\`
   once after the batch of related edits (see \`self-modifying-code\`).`,
  );
}

function assertPatched(root) {
  assertGone(root, "CHANGELOG.md", "changelog");
  assertGone(root, "changelog", "changelog directory");
  assertGone(root, "app/i18n", "i18n catalogs");
  assertGone(root, "app/i18n-data.ts", "i18n data");
  assertGone(root, "app/components/layout/Header.tsx", "header chrome");
  assertGone(root, "app/components/layout/Sidebar.tsx", "left sidebar");
  assertHomepageShape(root);
  assertContains(root, "app/components/layout/Layout.tsx", "Your agent here");
  assertContains(root, "app/components/layout/Layout.tsx", "defaultOpen");
  assertContains(root, "app/root.tsx", "Toggle theme");
  assertContains(root, "app/routes/settings.tsx", "Workspace preferences");
  assertContains(root, "drizzle/START_HERE.md", "drizzle/schema.ts");
  assertContains(root, "drizzle/crud-action-example.ts", "COPY-PASTE REFERENCE");
  const layout = readFileSync(
    path.join(root, "app/components/layout/Layout.tsx"),
    "utf8",
  );
  if (layout.includes('from "./Sidebar"') || layout.includes('from "./Header"')) {
    throw new Error("Layout still imports Header/Sidebar");
  }
  const rootSrc = readFileSync(path.join(root, "app/root.tsx"), "utf8");
  if (rootSrc.includes("i18nCatalog") || rootSrc.includes("changelog")) {
    throw new Error("root.tsx still wires i18n or changelog");
  }
}

function main() {
  const { root } = parseArgs(process.argv.slice(2));
  if (!existsSync(path.join(root, "app/routes/_index.tsx"))) {
    throw new Error(`does not look like the chat starter tree: ${root}`);
  }
  applyReplacements(root);
  copyOverlay(root);
  deleteListed(root);
  assertPatched(root);
  console.log(`Applied Fusion starter patch to ${root}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
