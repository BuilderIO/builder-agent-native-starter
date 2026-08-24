# Verifying the Fusion overlay

## Automated (every template PR)

`.github/workflows/verify-starter-patch.yml` applies this overlay onto a
throwaway archive of the PR tree and asserts:

- Homepage is a `return (\n    <div` canvas containing "Your app here"
- Layout has an always-open right agent rail labeled "Your agent here"
- Changelog and i18n catalogs are gone
- Drizzle discovery files exist

## After merge to `template`

The next push to `template` runs `sync.yml`, which merges into `main`, applies
this overlay, then typechecks and builds. Failures stay off `main`.

## Fusion first-prompt comparison (manual, ENG-13611)

After `main` has a patched revision:

1. Create two Fusion projects from `agent-native-starter` (before SHA vs after)
2. Use the same first prompt as the ENG-13611 React-vs-agent-native evidence
3. Record time-to-first-edit, total completion, discovery tool calls, and
   typecheck count
4. Confirm Fusion still injects `FUSION_GENERATION_APP_PLACEHOLDER` into
   `app/routes/_index.tsx`

This repo cannot run that comparison from CI; attach numbers on ENG-13611.
