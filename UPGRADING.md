# Dependency upgrade notes

Most of the project's dependencies are on their latest release. A few are held
back deliberately, because moving to the newest version would silently break
something. This file records what is pinned, why, and what has to happen before
the pin can be lifted.

## How the upgrades were verified

The repository has no build or lint CI, so each change was checked locally with:

```bash
pnpm run lint
pnpm run format:check
npx astro check
ASTRO_DATABASE_FILE=.astro/local.db npx astro build
```

`ASTRO_DATABASE_FILE` points Astro DB at a throwaway local SQLite file so the
build runs without Turso credentials. The regular `pnpm run build` still uses
`--remote` and needs the real database.

Two checks beyond the standard commands were used for the riskier migrations:

- **Tailwind v4.** The CSS emitted by the production build was parsed with
  PostCSS and the set of class selectors was diffed against a v3 build of
  `master`. Every difference corresponded to a documented v4 rename, so no
  styles were lost.
- **React 19.** The app was loaded in headless Chrome and every `astro-island`
  was confirmed to hydrate with no console errors or hydration mismatches.

## Held back

### Astro — pinned to 5.x (latest is 7)

Astro 6 and 7 are both blocked, for separate reasons.

**Astro 7 removes `@astrojs/db`.** The package is [gone and unmaintained as of
v7](https://docs.astro.build/en/guides/upgrade-to/v7/#removed-astrojsdb). This
project uses it for its entire persistence layer: `db/config.ts` defines the
`User`, `Session`, `Account` and `Verification` tables that back better-auth,
plus `Watching` and `Watchlist`. Moving off it means porting the schema to
Drizzle, rewriting the queries in `src/utils/watchlist.ts`,
`src/utils/watching.ts` and `src/pages/api/watching.ts`, and migrating a live
Turso database whose schema is currently tracked by Astro DB's own migration
system. That is a data-layer rewrite rather than a dependency bump, and it
cannot be validated without access to the production database.

**Astro 6 silently breaks the PWA and legacy browser builds.** Astro 6 moved to
[Vite's Environment API](https://docs.astro.build/en/guides/upgrade-to/v6/#vite-environment-api).
Under it, `config.build.ssr` is `true` for _every_ build pass, including the one
that writes client assets. Both `vite-plugin-pwa` and `@vitejs/plugin-legacy`
decide whether to emit client output by checking `!config.build.ssr`, so both
stop producing anything. Building this project on Astro 6 drops
`dist/client/sw.js`, `dist/client/workbox-*.js`, `dist/client/registerSW.js` and
all 33 legacy bundles, with no error — the build reports success.

This is a known upstream gap, tracked in
[vite-plugin-pwa#902](https://github.com/vite-pwa/vite-plugin-pwa/issues/902),
where Astro is named explicitly. The official `@vite-pwa/astro` integration
would sidestep it for the service worker, but its latest release (1.2.0) still
declares `astro` support only up to `^5.0.0`.

Scoping the two plugins to the client environment with `applyToEnvironment` and
letting them see that pass as non-SSR was tried, and made things worse: the
legacy plugin then applied its SystemJS output format to the prerender entry and
the build failed outright with `System is not defined`, while the PWA plugin
retargeted its asset glob at `dist/server`.

To unpin: `vite-plugin-pwa` and `@vitejs/plugin-legacy` need to detect the
client build via `this.environment.config.consumer === 'client'` instead of
`build.ssr`. Astro 7 additionally needs the Astro DB replacement above.

Held at 5.x alongside Astro: `@astrojs/vercel` (9.x), `@astrojs/cloudflare`
(12.x), `@astrojs/react` (4.x), `@astrojs/db` (0.20.x) and
`@vitejs/plugin-legacy` (6.x, the last line built for Vite 6).

### ESLint — pinned to 9 (latest is 10)

`eslint-plugin-react` 7.37.5, the current release, declares support only up to
`eslint@^9.7`, and `neostandard` requires `^9.0.0`. Going to ESLint 10 means
dropping both, which would lose the React rule set and the `standard` style
baseline the project has always used.

`eslint-plugin-astro` is held at 1.7.0 for the same reason: 2.x and 3.x both
require `eslint >= 10`.

To unpin: `eslint-plugin-react` and `neostandard` need to declare ESLint 10
support.

### TypeScript — pinned to 6 (latest is 7)

TypeScript 7 is outside the supported range of both `@astrojs/check`
(`^5.0.0 || ^6.0.0`) and `typescript-eslint` (`>=4.8.4 <6.1.0`), which are the
two tools that consume it here.

TypeScript 6 does leave two advisory peer warnings from packages Astro 5 pulls
in transitively, `tsconfck` (wants `^5.0.0`) and `zod-to-ts` (wants
`^4.9.4 || ^5.0.2`). Both were checked and work: `astro sync` generates content
types and the production build completes normally.

## Removed

- `lucide-astro` — deprecated in favour of `@lucide/astro`, and not imported
  anywhere. Only `lucide-react` is used.
- `@radix-ui/react-icons` — not imported anywhere.
- `@astrojs/tailwind` — replaced by `@tailwindcss/vite`, which is how Tailwind 4
  integrates with Astro.
- `eslint-config-standard-with-typescript` — deprecated by its authors in favour
  of `eslint-config-love`. `neostandard` was chosen instead, as it is the direct
  flat-config successor to `eslint-config-standard` and keeps the project's
  existing style baseline; `eslint-config-love` has since diverged into a much
  stricter ruleset.

## Newly declared

`workbox-build`, `workbox-window` and `wrangler` are now direct devDependencies.
They are non-optional peers of `vite-plugin-pwa` and `@astrojs/cloudflare`
respectively, and were previously left to pnpm's peer auto-install, which had
pinned the workbox packages below the range `vite-plugin-pwa` supports.
