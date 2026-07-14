---
name: app-branding
description: >-
  Keep every app identity surface consistent. Use when a prompt provides or
  implies a new app name, title, icon, brand, or visual identity.
---

# App Branding

## Trigger

Use this workflow for any prompt that provides or implies an app name, title, or
brand, such as "rename this app to ...", "this is a Todo app called ...", or
"call this app ...".

Apply all branding updates in a single consistent pass.

## Steps

### 1. Update `app/lib/app-config.ts`

This is the primary source of truth. Change both constants:

- `rawAppName` — URL/slug form using lowercase letters, digits, and hyphens only,
  such as `"my-task-app"`.
- `rawAppTitle` — human-readable display title, such as `"My Task App"`.

Everything in the frontend (`<title>`, header, sidebar, `h1`, and route metadata)
derives from these automatically.

### 2. Update `server/plugins/auth.ts`

This file has its own duplicate `rawAppTitle` for login and signup pages. Set it
to the same human-readable title as `app/lib/app-config.ts`.

### 3. Update `package.json`

Update:

- `displayName` to the human-readable title.
- `description` to a one-sentence description of what the app does.
- `name` to the slug only if the user explicitly asks to rename the package.

### 4. Update `public/manifest.json`

Update:

- `name` to the human-readable title shown in OS app drawers after installation.
- `short_name` to a compact launcher label, ideally 12 characters or fewer;
  truncate or abbreviate long titles.
- `description` to the same one-sentence description used in `package.json`.

### 5. Replace the icon SVG files

Replace all four files with one consistent SVG icon reflecting the new app
identity, using SVG primitives instead of a base64-encoded PNG:

- `public/favicon.svg` — browser tab favicon.
- `public/icon-180.svg` — Apple touch icon.
- `public/icon-192.svg` — PWA install icon for Android and Chrome.
- `public/icon-512.svg` — large PWA install and splash icon.

All four icons must share the same visual design; only their `width` and `height`
attributes differ. A simple approach is a filled rounded square in the brand
color with the first letter or a relevant icon mark centered in white.

Adapt this template to the app identity:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#2563EB"/>
  <text x="96" y="130" font-family="system-ui, sans-serif" font-size="110"
        font-weight="700" fill="white" text-anchor="middle">A</text>
</svg>
```

Adjust `fill`, the letter or glyph, and `rx` to suit the app's identity.

## Do Not Change

- Leave `server/plugins/agent-chat.ts` `appId` as
  `"builder-agent-native-starter"`; it is a stable platform identifier.
- Do not modify `.github/workflows/`; those files provide template automation.
- Do not modify `DEVELOPING.md`; it documents the template itself.

## Verification

Confirm the title, slug, description, manifest labels, auth title, and all four
icons are mutually consistent. Verify that the protected stable identifier and
template files remain unchanged.
