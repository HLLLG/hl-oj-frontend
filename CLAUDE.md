# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (http://localhost:5173)
npm run build        # type-check + production build
npm run type-check   # vue-tsc only
npm run lint         # oxlint + eslint (both with --fix)
npm run format       # prettier on src/
```

No test suite is set up yet.

## Architecture

**Stack:** Vue 3 (Composition API) + TypeScript + Vite 8, Ant Design Vue 4 (fully imported), Pinia, Vue Router 5.

**Key libraries:**
- `md-editor-v3` — Markdown editor (`MdEditor` for editing, `MdPreview` for read-only display). Always pass `theme="dark"`. CSS imported globally in `main.ts`.
- `@guolao/vue-monaco-editor` — Monaco Editor Vue 3 wrapper loaded from CDN. Registered globally in `main.ts` as `VueMonacoEditorPlugin`; CDN path is `https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs`. Use `<vue-monaco-editor>` in templates.

### Entry & global setup

- **`App.vue`** — only contains Ant Design dark theme config (`theme.darkAlgorithm`, `colorPrimary: #6366f1`) and global CSS variables (`--oj-bg`, `--oj-primary`, etc.).
- **`src/main.ts`** — registers Pinia, Vue Router, Ant Design, and the Monaco editor plugin; imports `md-editor-v3` CSS and `src/access/access.ts`.
- **`src/access/access.ts`** — contains the `router.beforeEach` guard. On the first navigation it calls `loginUserStore.fetchLoginUser()` to hydrate user state, then uses `checkAccess()` to gate the route. Unauthenticated users are redirected to `/user/login?redirect=...`.

### Layout

All pages share one layout: `BasicLayout.vue` (header → `<router-view>` → footer). The root route `/` uses `BasicLayout` as its component; every page is a nested child of it.

### Access control

Three files work together:

| File | Role |
|---|---|
| `src/access/accessEnum.ts` | `NOT_LOGIN / USER / ADMIN` string constants |
| `src/access/checkAccess.ts` | Pure function: `checkAccess(loginUser, needAccess)` → boolean |
| `src/router/index.ts` | Every route carries `meta.access` and `meta.title` |

`GlobalHeader.vue` reads `router.options.routes[0].children`, filters by `checkAccess` and `!meta.hideInMenu`, then builds the nav menu dynamically. It maintains an `iconMap` keyed by route `name`. Routes with `hideInMenu: true` are never shown in the nav regardless of access level.

### Route structure

```
/                     → BasicLayout
  (index)             home           NOT_LOGIN  nav visible
  problems            problems       NOT_LOGIN  nav visible
  contests/ranking/discuss           NOT_LOGIN  nav visible
  admin               admin          ADMIN      nav visible
  admin/question      adminQuestion  ADMIN      nav visible (题目管理)
  admin/question/create              ADMIN      hideInMenu
  admin/question/edit/:id            ADMIN      hideInMenu
  question/:id        questionDetail NOT_LOGIN  hideInMenu
  submissions         submissions    USER       hideInMenu
/user/login                          NOT_LOGIN  hideInMenu (outside BasicLayout)
/user/register                       NOT_LOGIN  hideInMenu (outside BasicLayout)
```

### Question module (`src/views/question/`)

| File | Purpose |
|---|---|
| `QuestionManageView.vue` | Admin table: search, paginate, edit/delete actions |
| `QuestionCreateView.vue` | Admin form: title, tags, MdEditor content/answer, judge cases, judge config |
| `QuestionEditView.vue` | Same form pre-filled via `getQuestionById`; saves with `updateQuestion` |
| `QuestionDetailView.vue` | Split-panel: left = MdPreview + submission history tab; right = Monaco editor + submit + polling result |
| `QuestionSubmitListView.vue` | Submission history table with language/status filters and code view modal |

**Difficulty convention:** difficulty is stored as a tag (`简单` / `中等` / `困难`). Views that display difficulty extract it from `tags[]` and separate it from algorithm tags.

**Judge status polling:** after `doQuestionSubmit`, `QuestionDetailView` polls `getQuestionSubmitVoById` every 1.5 s for up to 60 s (40 attempts). Clear the interval in `onBeforeUnmount`.

**Admin vs user APIs:** `listQuestionByPage` (admin, returns `Question` with JSON-string fields) vs `listQuestionVoByPage` (user, returns `QuestionVO` with parsed arrays).

### Adding a new page

1. Create `src/views/XxxView.vue`.
2. Add the route to `src/router/index.ts` as a child of the root `/` route, with `meta: { access: ACCESS_ENUM.XXX, title: '...' }`. Add `hideInMenu: true` if it should not appear in nav.
3. If nav-visible, add an entry in `GlobalHeader.vue`'s `iconMap` keyed by the route `name`.

### Pinia store

`useLoginUserStore` (id `'id'`) exposes `loginUser` (reactive ref, initially `{ userName: '未登录' }`), `fetchLoginUser()` (calls `/user/get/login`), and `setLoginUser()`.

### TypeScript notes

`tsconfig.app.json` enables `noUncheckedIndexedAccess: true`. Any `Record<string, T>` lookup returns `T | undefined`; always provide a `?? fallback` (e.g. `map[key] ?? ''`).

### API layer

All API functions live in `src/api/` and use the `request()` helper from `src/request.ts`. The base URL is `http://localhost:8123/api`. Response shape is always `{ code, message, data }` — `code === 0` means success. The response interceptor redirects to `/user/login` on `code === 40100`.
