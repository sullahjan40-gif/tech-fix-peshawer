# Tech Fix Peshawar — Phase 3

## Frontend Migration to Next.js

## Objective

Migrate the existing React/Vite frontend into the Next.js App Router according to:

```text
PHASE_1_MIGRATION_ANALYSIS.md
PHASE_2_COMPLETION.md
```

The goal is to preserve the existing UI and functionality.

Do not redesign the website.

---

## 1. Read Previous Phases

Before modifying anything:

1. Read Phase 1 analysis.
2. Read Phase 2 completion report.
3. Follow the approved route map.
4. Follow the approved component map.
5. Follow the approved dependency map.

Do not invent routes.

---

## 2. Migrate Routes

Convert every confirmed React route into the corresponding Next.js App Router route.

Use:

```text
app/<route>/page.tsx
```

according to the Phase 1 route map.

Preserve existing public URLs.

---

## 3. Migrate Components

Move existing React components into the appropriate Next.js structure.

Possible structure:

```text
components/
components/ui/
components/layout/
components/admin/
```

Use the actual project structure where appropriate.

Do not duplicate components unnecessarily.

---

## 4. Server vs Client Components

For every component determine whether it requires:

```text
"use client";
```

Use Client Components when the component actually requires:

* useState
* useEffect
* event handlers
* browser APIs
* Firebase browser authentication
* interactive forms

Prefer Server Components where possible.

Do not make the entire application a Client Component.

---

## 5. Routing Behavior

Preserve:

* navigation
* links
* redirects
* protected routes
* query parameters
* dynamic routes

Replace React Router functionality with Next.js routing APIs.

Do not change URL behavior unless required by the approved migration plan.

---

## 6. Assets

Move required static assets to:

```text
public/
```

Update paths without breaking existing functionality.

If using Next.js image handling, configure it according to actual image sources.

---

## 7. Forms

Migrate all existing forms.

Preserve:

* validation
* fields
* loading states
* error states
* success messages
* API behavior

Do not replace real API calls with mock data.

---

## 8. Admin UI

Migrate the existing admin interface visually and functionally.

At this stage:

* migrate the UI
* preserve the existing authentication integration points
* do not redesign authentication

The actual backend authentication migration happens in Phase 5.

---

## 9. API Calls

Do not invent new APIs.

Use the API paths confirmed in Phase 1.

If an API endpoint has not yet been migrated to Next.js, keep the integration clearly identified rather than silently changing its behavior.

---

## 10. Styling

Preserve:

* Tailwind classes
* responsive design
* spacing
* typography
* colors
* animations
* existing UI behavior

Do not redesign.

---

## 11. Verification

Run:

```bash
npm run build
```

Fix TypeScript and build errors.

Test every migrated route.

Test:

```text
desktop
mobile
navigation
forms
admin UI
```

---

## 12. Completion Report

Create:

```text
PHASE_3_COMPLETION.md
```

Include:

1. Routes migrated
2. Components migrated
3. Client Components created
4. Server Components created
5. Assets migrated
6. Forms migrated
7. Build result
8. Remaining API dependencies
9. Remaining issues

---

## STOP

Do not begin backend/API migration.

Wait for approval for Phase 4.
