---
name: authentication
description: >-
  How to wire this app's login experience through the framework's
  createAuthPlugin — branded loginHtml, public paths, and signup/logout UI.
  Read before creating or editing server/plugins/auth.ts, or before adding
  gated routes / a public marketing page.
scope: dev
metadata:
  internal: true
---

# Authentication

## Rule

If a user requests authentication or login or other similar terms, you should setup
authentication in their app using this skill.

`server/plugins/auth.ts` exports `createAuthPlugin(options)` from
`@agent-native/core/server` — that plugin is the app's auth. Do not hand-roll
session cookies, a parallel login route, or a custom auth backend; configure
the existing plugin instead.

## Branded login page

Pass `loginHtml: string` — a full HTML document that replaces the built-in
login page and its framework chrome entirely, so it can carry this app's own
layout, fonts, colors, and copy. Write it to match this app's actual look and
feel (its palette, type, and voice) — do not ship the generic framework login
page, and do not reuse another app's `loginHtml` verbatim without replacing
its copy and styling first.

The login HTML must call the framework's own auth endpoints, so behavior
matches the built-in page:

- `POST /_agent-native/auth/register { email, password, callbackURL? }` →
  `{ ok: true }` or `{ error }`
- `POST /_agent-native/auth/login { email, password }` → sets the session
  cookie and returns `{ ok: true }` or `{ error }`
- `GET /_agent-native/google/auth-url?return=<path>` → `{ url }` to send the
  browser to for Google sign-in (only relevant when Google OAuth is
  configured)

On success there is no redirect to follow — reload the current URL (e.g.
`location.reload()`) and it now passes the auth guard.

**This shortcut only works at the root path.** For any other gated route
(e.g. `/toppings`), the client `<RequireSession>` gate does not serve
`loginHtml` in place at that URL — it navigates the browser to
`/sign-in?c=<opaque-continuation>` first, so `location.reload()` there just
re-shows the login form forever instead of returning the visitor to
`/toppings`. To resume the original page, decode that continuation with the
framework's own helper instead of hand-rolling redirect logic:

```html
<script>${signInJourneyInlineScript()}</script>
<!-- import { signInJourneyInlineScript } from "@agent-native/core/shared" -->
<script>
  var journey = __anCreateSignInJourney("", "/"); // basePath, app home path
  var resumeHref = journey.journeyForLocation(window.location).resumeHref;
  // On page load: if already authenticated, window.location.replace(resumeHref)
  // On login/signup success: window.location.replace(resumeHref) instead of reload()
</script>
```

`resumeHref` decodes the `c` continuation back to the originally-requested
path (falling back to the app home when there isn't one). Embed
`signInJourneyInlineScript()` in every custom `loginHtml` that guards more
than just `/`.

The login page must include:

- A **sign-in** form (email/password) posting to `/_agent-native/auth/login`.
- A **sign-up** control — a visible "Sign up" / "Create account" affordance
  that posts to `/_agent-native/auth/register`. Never ship a login-only page
  with no way to register.

## Logging out

Once a user is signed in, the app's authenticated UI must include a **logout**
control — do not leave users with no way to sign out. Use the framework's
`signOut()` helper from `@agent-native/core/client` rather than posting to
`/_agent-native/auth/logout` directly; it revokes the server session and only
then navigates, avoiding a stale authenticated screen that renders against a
dead cookie:

```ts
import { signOut } from "@agent-native/core/client";

<button onClick={() => signOut()}>Log out</button>;
```

## Public paths

`workspaceAppPublicPaths: string[]` exempts page-route prefixes from the
private-app auth gate, e.g. `["/"]` so a logged-out visitor hitting the
marketing root gets the SPA (which renders the public landing page) instead of
being redirected to sign-in. Every route not listed here — and every
action/API — stays gated and requires a session. Set this explicitly for any
route a signed-out visitor should be able to reach; use
`workspaceAppProtectedPaths` for the inverse (an otherwise-public audience
with specific pages, e.g. an admin screen, that must still require a session).

**This only configures the server.** There is a SEPARATE client-side gate in
`app/root.tsx`: `<AppProviders queryClient={...}>` defaults its `isPublicPath`
prop to `false`, which wraps the *entire* app in `<ClientOnly>` +
`<RequireSession>` — every route, including ones already listed in
`workspaceAppPublicPaths`. Setting `workspaceAppPublicPaths` alone does
**not** make a page public; the two must be kept in sync by hand:

```tsx
// app/root.tsx — must match workspaceAppPublicPaths in server/plugins/auth.ts
const PUBLIC_PATHS = ["/", "/menu", "/order"];

export default function Root() {
  const location = useLocation();
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  return (
    <AppProviders queryClient={queryClient} isPublicPath={isPublicPath}>
      {/* ... */}
    </AppProviders>
  );
}
```

Forgetting this makes every route require sign-in even when the server
config says otherwise — the symptom is public marketing pages redirecting to
login for no apparent reason. When adding or changing
`workspaceAppPublicPaths`, always update this array in `app/root.tsx` too.

## Example

```ts
import { createAuthPlugin } from "@agent-native/core/server";

export default createAuthPlugin({
  workspaceAppPublicPaths: ["/"],
  loginHtml: `<!doctype html>
<html>
  <head>
    <title>Sign in — Acme</title>
    <style>/* match this app's palette, type, and voice */</style>
  </head>
  <body>
    <!-- sign-in form -> POST /_agent-native/auth/login -->
    <!-- sign-up form/toggle -> POST /_agent-native/auth/register -->
    <script>
      // On { ok: true } from either endpoint: location.reload()
    </script>
  </body>
</html>`,
});
```
