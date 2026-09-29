# Tech Fix Peshawar — Phase 2

## Next.js Foundation Implementation

## Objective

Implement the Next.js foundation based ONLY on the approved Phase 1 analysis:

```text
PHASE_1_MIGRATION_ANALYSIS.md
```

Do not make assumptions that were not confirmed during Phase 1.

Do not migrate the entire application yet.

This phase establishes the Next.js project foundation.

---

## 1. Read Phase 1 First

Before modifying anything:

1. Read `PHASE_1_MIGRATION_ANALYSIS.md`.
2. Follow its confirmed architecture.
3. Use its actual dependency inventory.
4. Use its actual environment-variable inventory.
5. Use its actual route mapping.
6. Use its actual Firebase findings.

If Phase 1 contains `UNKNOWN` items that affect this phase, stop and report them instead of guessing.

---

## 2. Create Next.js Architecture

Create the Next.js App Router structure required by the Phase 1 migration map.

Use:

```text
Next.js
TypeScript
React 19
Tailwind CSS
App Router
```

Do not use the Pages Router unless Phase 1 explicitly requires it.

---

## 3. Package Configuration

Update `package.json` according to the approved dependency plan.

Required scripts should be equivalent to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Use the appropriate current Next.js-compatible lint configuration if the installed Next.js version does not support the exact command above.

Do not blindly copy this example.

Verify the actual installed Next.js version.

---

## 4. Remove Vite Dependency From the Runtime

The final architecture must not depend on Vite.

Remove Vite only after confirming that the new Next.js foundation works.

Do not delete useful source files prematurely.

Do not migrate application components yet unless required for the foundation.

---

## 5. TypeScript

Configure TypeScript for Next.js.

Preserve existing strictness where practical.

Do not weaken TypeScript simply to make errors disappear.

---

## 6. Tailwind CSS

Configure Tailwind for the Next.js source directories identified in Phase 1.

Preserve the existing Tailwind design system.

Do not redesign the application.

---

## 7. Environment Structure

Create:

```text
.env.example
```

using ONLY the variables confirmed in Phase 1.

Separate:

```text
NEXT_PUBLIC_*
```

from server-only variables.

Never copy actual secrets.

Do not change production secrets.

---

## 8. Next.js Configuration

Create the appropriate:

```text
next.config.ts
```

based on actual project requirements.

Only configure:

* image domains/remote patterns if actually required
* required redirects
* required rewrites
* required headers

Do not add unnecessary configuration.

---

## 9. Public Assets

Prepare:

```text
public/
```

according to the Phase 1 asset migration map.

Do not remove existing assets.

---

## 10. Initial Layout

Create the basic:

```text
app/layout.tsx
```

using the existing application's actual:

* fonts
* metadata where known
* global CSS
* providers where required

Do not migrate complete application pages yet.

---

## 11. Firebase Client Foundation

Only if Phase 1 confirms it is required, create:

```text
lib/firebase.ts
```

for browser Firebase initialization.

Do not implement Firebase Admin yet unless Phase 1 explicitly requires it for the foundation.

Never expose server credentials.

---

## 12. Shared Types

Create only the shared TypeScript types confirmed as useful by Phase 1.

Do not rewrite all existing types unnecessarily.

---

## 13. Verification

Run:

```bash
npm install
npm run build
```

Fix foundation errors.

Then run the development server and verify that Next.js starts successfully.

---

## 14. Do Not Implement Yet

Do NOT migrate:

* all frontend pages
* all React components
* Express APIs
* admin authentication
* Firestore business logic
* Storage operations
* email APIs

Those belong to later phases.

---

## 15. Completion Report

Create:

```text
PHASE_2_COMPLETION.md
```

Include:

1. Files created
2. Files modified
3. Dependencies changed
4. Vite dependencies removed
5. Next.js version
6. TypeScript status
7. Tailwind status
8. Environment-variable structure
9. Build result
10. Remaining issues

If anything is uncertain, label it:

```text
UNKNOWN — REQUIRES REVIEW
```

Do not guess.

---

## STOP

After completing Phase 2:

**STOP.**

Do not begin Phase 3.

Wait for approval.
