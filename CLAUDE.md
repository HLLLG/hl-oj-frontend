# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # type-check + build
npm run type-check   # vue-tsc only
npm run lint         # oxlint + eslint (both with --fix)
npm run format       # prettier on src/
```

No test suite is set up yet.

## Architecture

**Stack:** Vue 3 (Composition API) + TypeScript + Vite, Ant Design Vue 4 (fully imported), Pinia, Vue Router 5.

### Entry & global setup (`App.vue`)

`App.vue` is the single place for:
- Calling `loginUserStore.fetchLoginUser()` on app start (currently mocked with a 3-second timeout; real API call is commented out).
- The global `router.beforeEach` navigation guard — this is where route-level access control is enforced.
- Ant Design dark theme configuration (`theme.darkAlgorithm`, custom `colorPrimary: #6366f1`).
- Global CSS variables (`--oj-bg`, `--oj-primary`, etc.) and Ant Design component overrides.

### Layout

All pages share one layout: `BasicLayout.vue` (header → `<router-view>` → footer). The root route `/` uses `BasicLayout` as its component; all pages are nested children.

### Access control

Three files work together:

| File | Role |
|---|---|
| `src/access/accessEnum.ts` | Defines `NOT_LOGIN / USER / ADMIN` string constants |
| `src/access/checkAccess.ts` | Pure function: `checkAccess(loginUser, needAccess)` → boolean |
| `router/index.ts` | Every route carries `meta.access` (from `ACCESS_ENUM`) and `meta.title` |

`GlobalHeader.vue` reads `router.options.routes[0].children`, filters by `checkAccess`, and builds the nav menu dynamically — so adding a new route with `meta.access` + `meta.title` is enough to control its visibility in the nav.

The `router.beforeEach` guard in `App.vue` uses `checkAccess` + `meta.access` to block navigation and redirects back to the previous route on failure.

### Adding a new page

1. Create `src/views/XxxView.vue`.
2. Add the route to `router/index.ts` with `meta: { access: ACCESS_ENUM.XXX, title: '...' }`.
3. Add an entry in `GlobalHeader.vue`'s `iconMap` keyed by the route `name`.

### Pinia store

`useLoginUserStore` exposes `loginUser` (reactive ref), `fetchLoginUser()` (async, to be wired to real API), and `setLoginUser()`. The store id is `'id'` — change this to something descriptive when the store is stable.
