# web

The Robot Shop storefront: a React + TypeScript single-page app built with Vite and styled with Tailwind CSS v4.
In the container it is served by nginx, which also reverse-proxies `/api/*` to the backend services.

## Layout

| Path | Purpose |
|---|---|
| `src/pages/` | One component per route: splash, search, product, login, cart, shipping, payment |
| `src/components/` | Layout, category nav, location autocomplete, shared UI |
| `src/ShopContext.tsx` | Session state shared across pages (unique id, user, cart) |
| `src/api.ts` | Typed client for every backend call |
| `public/` | Served as-is: product images, media, and the Instana EUM snippets used by `entrypoint.sh` |
| `default.conf.template` | nginx config; `envsubst` fills in the service hostnames at start-up |

## Local development

```sh
npm install
npm run dev          # http://localhost:5173
```

`/api/*` is proxied to `http://localhost:8080` (the `web` container from `docker compose up`).
Point it somewhere else with `API_PROXY=http://host:port npm run dev`.

```sh
npm run typecheck    # tsc, strict mode
npm run build        # outputs dist/
```

## Docker

The Dockerfile is a two-stage build: Node compiles the app, then `nginx:1.21.6` serves `dist/`.
The runtime environment variables (`CATALOGUE_HOST`, `USER_HOST`, ..., `INSTANA_EUM_KEY`) and
`entrypoint.sh` behave exactly as before.

Notes:
- nginx falls back to `index.html` for unknown paths, so routes like `/product/RMC` survive a refresh.
- `index.html` keeps the `<!--# include file="eum.html" -->` SSI directive, so Instana EUM injection still works.
- Route changes report the same `ineum('page', 'product.html')` style names as the old AngularJS app.
