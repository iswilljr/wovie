# AGENTS.md

## Cursor Cloud specific instructions

Wovie is a single Astro 5 (SSR) + React app for browsing/watching movies. It pulls catalog
data from TMDB and renders playback via third-party `<iframe>` providers. Auth + per-user
"Continue Watching"/"Watchlist" use `better-auth` on a libSQL/SQLite database. Package
manager is `pnpm` (Node 22 works). Default dev port is `4321`.

Standard commands live in `package.json`/`README.md`; only the non-obvious caveats are below.

### Required `.env` for local dev (not committed)

`astro.config.mjs` declares several `astro:env` vars as **required**, so the app refuses to
start unless they exist. There is no committed `.env`, so create one (`.env` is gitignored):

```bash
TMDB_KEY="PLACEHOLDER_TMDB_KEY"            # real TMDB "API Read Access Token" needed for catalog data
BETTER_AUTH_URL="http://127.0.0.1:4321"
BETTER_AUTH_TRUSTED_ORIGINS="http://127.0.0.1:4321"
BETTER_AUTH_SECRET="<any random string>"   # e.g. node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ASTRO_DB_REMOTE_URL="file:.astro/content.db"
ASTRO_DB_APP_TOKEN="local-dev-token"
```

### Local database (no Turso account needed)

- `pnpm start` (`astro dev`, no `--remote`) runs Astro DB against a **local SQLite file** at
  `.astro/content.db`. `pnpm dev` uses `--remote`, which requires a real Turso/libSQL DB.
- `better-auth` (`src/utils/auth/server.ts`) connects **directly** to `ASTRO_DB_REMOTE_URL`
  via libSQL, bypassing Astro DB. Setting `ASTRO_DB_REMOTE_URL="file:.astro/content.db"` makes
  it share the same local file, so the `User`/`Session`/`Account`/`Verification` tables that
  Astro DB creates are reused and signup/login work fully offline.
- Astro DB **recreates `.astro/content.db` on every `astro dev` start** ("New local database
  created" / "Seeded database"), so local users/watchlist data are wiped on each restart.

### Auth "Invalid origin" gotcha (important for browser testing)

`better-auth` only trusts requests whose `Origin` matches its `baseURL` (`BETTER_AUTH_URL`);
`trustedOrigins` in `src/utils/auth/server.ts` is otherwise hardcoded to `wovix.app`. So you
must browse using the **exact same host:port** as `BETTER_AUTH_URL`, or signup/login fail with
"Invalid origin". Use `http://127.0.0.1:4321` consistently (set it in `.env` and navigate to
it). Do **not** use `localhost` interchangeably with `127.0.0.1`.

### IPv4 vs IPv6

`astro dev` binds to IPv4 only; `localhost` may resolve to IPv6 `::1` and give
`ERR_CONNECTION_REFUSED` in the browser. Use `127.0.0.1`, or start with
`pnpm exec astro dev --host 0.0.0.0`.

### Lint / type-check / build

- Lint: no `lint` script defined — run `pnpm exec eslint . --ext .js,.cjs,.mjs,.ts,.tsx,.astro`.
  The repo currently has pre-existing ESLint errors (mostly `no-unsafe-argument`); they are not
  from environment setup.
- Type-check: `pnpm exec astro check` (passes clean).
- Build: the `build` script uses `--remote` (needs Turso). For a local build without Turso, run
  `ASTRO_DATABASE_FILE="$PWD/.astro/content.db" pnpm exec astro build`.
- There are no automated tests in this repo.

### TMDB

With a placeholder `TMDB_KEY` the server runs but catalog rows render empty (Astro actions
catch the TMDB errors and return `[]`). A real TMDB API Read Access Token is required to see
movie/TV data and playback.
