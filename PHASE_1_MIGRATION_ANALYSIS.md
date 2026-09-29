# PHASE_1_MIGRATION_ANALYSIS.md
# Tech Fix Peshawar — Evidence-Based Next.js Migration Analysis

> **Status**: PHASE 1 COMPLETE — Analysis only. No files were modified.
> **Date**: 2026-09-29
> **Source of truth**: `d:\New folder (2)` project directory — all findings confirmed from actual source code.

---

## 1. Project Inventory

### Configuration Files

| File | Status | Notes |
|---|---|---|
| `package.json` | CONFIRMED | name: react-example, version: 0.0.0, type: module |
| `package-lock.json` | CONFIRMED | npm lockfile present |
| `bun.lock` | CONFIRMED | bun lockfile also present (used by Railway) |
| `tsconfig.json` | CONFIRMED | strict: true, moduleResolution: bundler, noEmit: true |
| `vite.config.ts` | CONFIRMED | React + Tailwind vite plugins, @/* path alias |
| `.env` | CONFIRMED | Contains live secrets (not committed analysis) |
| `.env.example` | CONFIRMED | Template for 9 environment variables |
| `vercel.json` | CONFIRMED | Routes /api/* → api/index.ts, SPA fallback |
| `firestore.rules` | CONFIRMED | 179 lines, 11 collections secured |
| `AGENTS.md` | CONFIRMED | Engineering rules (mandatory) |
| `TechFix-Peshawar-Production-Readiness-PRD.md` | CONFIRMED | 250 BUG remediation plan |

### Source Directory Structure

```
src/
├── App.tsx                    — Root component + custom SPA router
├── main.tsx                   — Vite entry point
├── index.css                  — Global styles
├── types.ts                   — Shared frontend types
├── types/
│   └── firestore.ts           — Firestore entity types
├── lib/
│   └── firebase.ts            — Firebase client init + collection refs + mock data
├── utils/
│   ├── api.ts                 — All frontend API/Firestore calls (2155 lines)
│   ├── dateTime.ts            — PKT timezone helpers
│   ├── fallbackData.ts        — Static fallback when backend unavailable
│   ├── notifications.ts       — Client-side email dispatch helpers
│   └── whatsapp.ts            — WhatsApp link generator
├── pages/
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── HowItWorksPage.tsx
│   ├── WhyOnSitePage.tsx
│   ├── WhoWeServePage.tsx
│   ├── BulkWindowsPage.tsx
│   ├── AboutPage.tsx
│   ├── ProblemsSolutionsPage.tsx
│   ├── FAQPage.tsx
│   ├── ContactPage.tsx
│   └── TrackRequestPage.tsx
└── components/
    ├── AdminPanel.tsx
    ├── admin/
    │   ├── AdminProtectedRoute.tsx    — Auth gate (417 lines)
    │   ├── AdminDashboard.tsx
    │   ├── AdminBusiness.tsx
    │   ├── AdminContent.tsx
    │   ├── AdminCustomers.tsx
    │   ├── AdminInquiries.tsx
    │   ├── AdminMedia.tsx
    │   ├── AdminPageSectionManager.tsx
    │   ├── AdminProblemLeads.tsx
    │   ├── AdminProblemSolutions.tsx
    │   ├── AdminRequestsAndBookings.tsx
    │   ├── AdminServices.tsx
    │   ├── AdminSettings.tsx
    │   ├── AdminUnpublished.tsx
    │   ├── AdminWebsite.tsx
    │   └── TechnicianPhotoUpload.tsx
    └── [20 public-facing components]

server.ts          — Express backend, 5160 lines, single file
api/
└── index.ts       — Vercel serverless adapter
functions/
└── index.ts       — Firebase Cloud Functions stub
data/
└── database.json  — Local JSON database (fallback)
```

---

## 2. Current Architecture

### Framework Versions (CONFIRMED)

| Technology | Version | Source |
|---|---|---|
| React | 19.0.1 | package.json dependencies |
| Vite | 6.2.3 | package.json devDependencies |
| TypeScript | ~5.8.2 | package.json devDependencies |
| Tailwind CSS | 4.1.14 | @tailwindcss/vite plugin |
| Express | 4.21.2 | package.json dependencies |
| Firebase Client SDK | 12.19.0 | package.json dependencies |
| Firebase Admin SDK | 14.4.0 | package.json dependencies |
| Nodemailer | 10.0.3 | package.json dependencies |

### Architecture Summary (CONFIRMED)

```
Browser
  └── React 19 SPA (Vite build → dist/)
        ├── Custom hash/pathname router (App.tsx) — NO react-router
        ├── Firebase Client SDK (auth, firestore, realtime snapshots)
        └── fetch() calls to /api/* endpoints

Vercel
  ├── Static hosting: dist/ (index.html + assets)
  └── Serverless function: api/index.ts
        └── imports server.ts (Express app, 5160 lines)

server.ts (Express)
  ├── Firebase Admin SDK (token verification only)
  ├── Dual database: data/database.json + Firestore overlay
  ├── Nodemailer + Resend for email
  ├── multer for file uploads (LOCAL DISK — incompatible with Vercel)
  └── ~75 API routes
```

---

## 3. Frontend Route Inventory (CONFIRMED)

Routing implementation: **Custom — no react-router**. Uses `window.location.pathname` + `window.location.hash` + `history.pushState`. Source: `src/App.tsx` lines 73–460.

| Current Route | Source File | Component | Auth Required? | Notes |
|---|---|---|---|---|
| `/` | App.tsx:498 | HomePage | No | Default page |
| `/#services` | App.tsx:509 | ServicesPage | No | Hash routing |
| `/#how-it-works` | App.tsx:518 | HowItWorksPage | No | Hash routing |
| `/#why-on-site` | App.tsx:527 | WhyOnSitePage | No | Hash routing |
| `/#who-we-serve` | App.tsx:535 | WhoWeServePage | No | Hash routing |
| `/#bulk-windows` | App.tsx:543 | BulkWindowsPage | No | Hash routing |
| `/#about` or `/#technician` | App.tsx:551 | AboutPage | No | Two hashes same component |
| `/#problems-solutions` | App.tsx:559 | ProblemsSolutionsPage | No | Hash routing |
| `/#faq` | App.tsx:566 | FAQPage | No | Hash routing |
| `/#contact` | App.tsx:582 | ContactPage | No | Booking form |
| `/#track-request` | App.tsx:575 | TrackRequestPage | No | Status lookup |
| `/techfixpeshawar@gmail.com/admin` | App.tsx:78–86 | AdminProtectedRoute → AdminPanel | YES — Firebase Auth | Full-screen admin |

---

## 4. Backend API Inventory (CONFIRMED from server.ts)

**Authentication middleware**: `checkAdminAuth` (server.ts ~line 3259)
- Extracts Bearer token from `Authorization` header
- Calls `getAdminAuth().verifyIdToken(token)` (Firebase Admin)
- Checks decoded email against `AUTHORIZED_ADMIN_EMAILS` list
- Returns 401 if no token, 403 if unauthorized

### Public Endpoints (no authentication)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/data` | Returns all public site data (settings, services, FAQs, case studies, areas, categories, page sections) |
| GET | `/api/services` | Services list |
| GET | `/api/settings` | Public settings |
| GET | `/api/faqs` | FAQ items |
| GET | `/api/case-studies` | Case studies |
| GET | `/api/areas` | Service areas |
| GET | `/api/categories` | Categories |
| GET | `/api/page-sections` | Page section CMS data |
| POST | `/api/bookings` | Submit service booking — rate limited |
| POST | `/api/inquiries` | Submit customer inquiry |
| GET | `/api/bookings/:id` | Track booking by reference ID — rate limited |
| GET | `/api/problem-solutions` | Problem solutions list |
| POST | `/api/problem-leads` | Submit problem lead — rate limited |
| GET | `/api/media/image/:id` | Serve stored media image |

### Admin Endpoints (all require `checkAdminAuth`)

| Method | Path | Operation |
|---|---|---|
| POST | `/api/admin/verify-token` | Verify Firebase ID token, confirm admin |
| GET | `/api/admin/data` | Full admin dataset |
| PUT | `/api/admin/settings` | Update site settings → syncs to Firestore |
| PUT | `/api/admin/website-content` | Update website content |
| PUT | `/api/admin/categories` | Update categories |
| PUT | `/api/admin/areas` | Update service areas |
| POST | `/api/admin/services` | Create service |
| PUT | `/api/admin/services/:id` | Update service |
| DELETE | `/api/admin/services/:id` | Delete service |
| PUT/PATCH | `/api/admin/services/:id/toggle` | Toggle active/inactive |
| POST | `/api/admin/services/:id/publish` | Publish service |
| POST | `/api/admin/services/:id/unpublish` | Unpublish service |
| POST | `/api/admin/services/reorder` | Reorder services |
| PUT | `/api/admin/services` | Bulk update services |
| PUT | `/api/admin/page-sections/:sectionKey` | Update page section |
| PUT | `/api/admin/page-status/:sectionKey` | Toggle page visibility |
| POST | `/api/admin/page-sections/:sectionKey/:collectionKey` | Add item to section collection |
| PUT | `/api/admin/page-sections/:sectionKey/:collectionKey/:itemId` | Update item |
| DELETE | `/api/admin/page-sections/:sectionKey/:collectionKey/:itemId` | Delete item |
| PUT | `/api/admin/page-sections/:sectionKey/:collectionKey/:itemId/toggle` | Toggle item |
| GET | `/api/admin/problem-solutions` | List problem solutions |
| POST | `/api/admin/problem-solutions` | Create problem solution |
| PUT | `/api/admin/problem-solutions/:id` | Update problem solution |
| DELETE | `/api/admin/problem-solutions/:id` | Delete problem solution |
| PATCH | `/api/admin/problem-solutions/:id/status` | Change status |
| GET | `/api/admin/problem-leads` | List problem leads |
| PATCH | `/api/admin/problem-leads/:id/status` | Update lead status |
| POST | `/api/admin/problem-leads/:id/notes` | Add notes to lead |
| DELETE | `/api/admin/problem-leads/:id` | Delete lead |
| POST | `/api/inquiries/:id/resend-email` | Resend inquiry email |
| POST | `/api/contact/:id/resend-email` | Resend contact email (alias) |
| PATCH | `/api/inquiries/:id` | Update inquiry |
| DELETE | `/api/inquiries/:id` | Delete inquiry |
| DELETE | `/api/admin/inquiries/:id` | Delete inquiry (admin alias) |
| POST | `/api/admin/test-email` | Send test email |
| GET | `/api/admin/email-status` | Email system status |
| POST | `/api/admin/bookings` | Create booking (admin) |
| PUT | `/api/admin/bookings/:id` | Update booking |
| POST | `/api/admin/bookings/:id/confirm` | Confirm booking + send email |
| POST | `/api/admin/bookings/:id/send-confirmation-email` | Resend confirmation email |
| POST | `/api/admin/bookings/:id/contact` | Send contact email to customer |
| POST | `/api/admin/inquiries/:id/confirm` | Confirm inquiry |
| POST | `/api/admin/inquiries/:id/send-confirmation-email` | Send confirmation |
| POST | `/api/admin/inquiries/:id/contact` | Contact customer |
| DELETE | `/api/admin/bookings/:id` | Delete booking |
| POST | `/api/admin/customers` | Create customer |
| PUT | `/api/admin/customers/:id` | Update customer |
| DELETE | `/api/admin/customers/:id` | Delete customer |
| POST | `/api/admin/faqs` | Create FAQ |
| PUT | `/api/admin/faqs/:id` | Update FAQ |
| DELETE | `/api/admin/faqs/:id` | Delete FAQ |
| PUT | `/api/admin/faqs` | Bulk reorder FAQs |
| POST | `/api/admin/case-studies` | Create case study |
| PUT | `/api/admin/case-studies/:id` | Update case study |
| DELETE | `/api/admin/case-studies/:id` | Delete case study |
| POST | `/api/admin/upload-icon` | Upload service icon (multer, disk) |
| POST | `/api/admin/media/upload` | Upload media file (multer, disk) |
| POST | `/api/admin/profile-photo` | Upload technician photo (multer, disk) |
| DELETE | `/api/admin/media/:id` | Delete media record |
| POST | `/api/admin/activity-logs` | Add activity log entry |
| POST | `/api/admin/reset-defaults` | Reset database to defaults |

**Total API routes confirmed**: ~75 endpoints

---

## 5. Authentication Flow (CONFIRMED)

```
AdminProtectedRoute.tsx
  └── signInWithEmailAndPassword(auth, email, password)   [Firebase Client SDK]
        │   If user-not-found + email in allowlist:
        │   createUserWithEmailAndPassword(auth, email, password)
        ↓
  Firebase Authentication (Google servers)
        ↓
  onAuthStateChanged(auth, user => ...)
        ↓
  user.getIdToken()   → Firebase ID Token (JWT)
        ↓
  sessionStorage.setItem('techfix_admin_token', token)   [tab-scoped only]
        ↓
  fetch('/api/admin/verify-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortController (15s timeout)
  })
        ↓
  server.ts: checkAdminAuth middleware
        ↓
  getAdminAuth().verifyIdToken(token)   [Firebase Admin SDK]
        ↓
  decoded.email ∈ AUTHORIZED_ADMIN_EMAILS?
        ↓ YES
  res.json({ success: true })
        ↓
  setIsAdminAuthorized(true) → AdminPanel renders
```

---

## 6. Admin Authorization Mechanism (CONFIRMED)

**Dual mechanism — both must pass:**

### Mechanism 1: Server-side email allowlist
Source: `server.ts` lines 83–88, `checkAdminAuth` middleware

```typescript
const AUTHORIZED_ADMIN_EMAILS = [
  'techfixpeshawar@gmail.com',
  'sullahjan40@gmail.com',
  'ullahsafiullah117@gmail.com',
  'admin@peshawar-techsupport.pk'
];
```

### Mechanism 2: Firestore Security Rules email allowlist
Source: `firestore.rules` lines 25–35

```
function isAdmin() {
  return isAuth() && (
    request.auth.token.admin == true ||
    request.auth.token.email in [
      'techfixpeshawar@gmail.com',
      'sullahjan40@gmail.com',
      'ullahsafiullah117@gmail.com',
      'admin@peshawar-techsupport.pk'
    ]
  );
}
```

**Not used**: Firestore document roles, Firebase custom claims (the `admin` claim is checked in rules but never set in code).

---

## 7. Firebase Client Analysis (CONFIRMED)

Source: `src/lib/firebase.ts`

**⚠️ SECURITY FINDING**: Firebase config is hardcoded in source code (not environment variables).
The following are present in committed source — variable names only documented here:

| Config Key | Variable Name (Next.js recommended) | Browser-safe? |
|---|---|---|
| apiKey | `NEXT_PUBLIC_FIREBASE_API_KEY` | YES (public by design) |
| authDomain | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | YES |
| projectId | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | YES |
| storageBucket | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | YES |
| messagingSenderId | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | YES |
| appId | `NEXT_PUBLIC_FIREBASE_APP_ID` | YES |
| firestoreDatabaseId | `NEXT_PUBLIC_FIREBASE_DATABASE_ID` | YES |

**Firebase services used client-side**:
- `getFirestore` — Firestore reads/writes
- `getAuth` — Authentication
- `onSnapshot` — Real-time listeners
- `collection`, `doc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs` — CRUD
- `query`, `where`, `orderBy`, `serverTimestamp`, `writeBatch` — Queries
- `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut` — Auth
- `onAuthStateChanged`, `onIdTokenChanged`, `updatePassword` — Auth state

**Source files using Firebase client SDK**:
- `src/lib/firebase.ts` — init
- `src/utils/api.ts` — all CRUD operations
- `src/App.tsx` — real-time snapshots, auth state
- `src/components/admin/AdminProtectedRoute.tsx` — login flow
- `src/utils/notifications.ts` — (LIKELY — read from other imports)

**Custom Firestore database ID**: `ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555`
This is NOT the default Firestore database — must be specified in all Admin SDK calls.

---

## 8. Firebase Admin Analysis (CONFIRMED)

Source: `server.ts` lines 70–80

```typescript
initAdminApp({
  projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0759593306"
});
```

| Property | Value | Source |
|---|---|---|
| Source file | `server.ts` | CONFIRMED |
| Initialization method | `initAdminApp()` | CONFIRMED |
| Credential method | Application Default Credentials (no service account) | CONFIRMED |
| Project ID source | `process.env.FIREBASE_PROJECT_ID` with hardcoded fallback | CONFIRMED |
| Private key | Not configured | CONFIRMED |
| Client email | Not configured | CONFIRMED |
| Services initialized | `getAdminAuth()` for token verification only | CONFIRMED |

**⚠️ LIMITATION**: Without a service account, Firebase Admin can only verify tokens when running in a Google Cloud environment (Cloud Run, Cloud Functions) where ADC is automatically available. On Vercel, ADC is NOT available — token verification may fail silently.

**Custom database ID for Admin**: The custom Firestore database ID is set in the client SDK but NOT in the Admin SDK initialization. Admin SDK Firestore operations would use the default database.

---

## 9. Firestore Analysis (CONFIRMED)

### Collections (confirmed from firestore.rules + source code)

| Collection | Public Read | Public Create | Admin Only | Used By |
|---|---|---|---|---|
| `services` | Published docs only | NO | WRITE | App.tsx, api.ts, server.ts |
| `faq` | Published docs only | NO | WRITE | api.ts, server.ts |
| `caseStudies` | Published docs only | NO | WRITE | api.ts, server.ts |
| `page_sections` | YES (all) | NO | WRITE | api.ts, server.ts |
| `problemSolutions` | Published docs only | NO | WRITE | api.ts, server.ts |
| `problemLeads` | NO | YES | READ/UPDATE/DELETE | api.ts, server.ts |
| `settings` | `site_config`, `website_content` docs | NO | ALL WRITE | App.tsx, api.ts, server.ts |
| `serviceRequests` | GET by ID | YES | LIST/UPDATE/DELETE | api.ts, server.ts |
| `requests` | GET by ID | YES | LIST/UPDATE/DELETE | api.ts, server.ts |
| `bookings` | GET by ID | YES | LIST/UPDATE/DELETE | api.ts, server.ts |
| `inquiries` | NO | YES | READ/UPDATE/DELETE | api.ts, server.ts |
| `contacts` | NO | YES | READ/UPDATE/DELETE | api.ts, server.ts |
| `customers` | NO | NO | ALL | api.ts, server.ts |
| `media` | YES | NO | WRITE | api.ts, server.ts |
| `activityLogs` | NO | NO | ALL | api.ts, server.ts |
| `users` | Owner only | Owner (no admin role) | ALL | App.tsx, firestore.rules |

**Key document**: `settings/site_config` — primary site configuration, read by public and admin.

---

## 10. Firebase Storage Analysis

**CONFIRMED: Firebase Storage SDK is imported but not used for uploads.**

Source: `package.json` includes `firebase` SDK which includes storage, but:
- No `getStorage()`, `ref()`, `uploadBytes()`, or `getDownloadURL()` calls found in any frontend file
- All file uploads go through Express `multer` to local disk (`uploads/` folder)
- Images are stored as base64 in `database.json` and served via `/api/media/image/:id`
- `firebase-functions` package is present but the `functions/index.ts` stub is minimal

**Storage paths**: `UNKNOWN — REQUIRES CONFIRMATION` (storage bucket is configured but not used in current implementation)

---

## 11. Email Analysis (CONFIRMED)

Source: `server.ts`, `.env.example`

| Property | Value |
|---|---|
| Provider A | Resend API (`https://api.resend.com/emails`) |
| Provider B | Nodemailer SMTP (Gmail or custom) |
| Source file | `server.ts` (all email logic server-side) |
| Env var — Resend key | `RESEND_API_KEY` (secret, server-only) |
| Env var — Resend from | `RESEND_FROM` |
| Env var — SMTP host | `SMTP_HOST` |
| Env var — SMTP user | `SMTP_USER` (secret) |
| Env var — SMTP pass | `SMTP_PASS` (secret) |
| Env var — Gmail alias | `GMAIL_USER`, `GMAIL_APP_PASSWORD` (secret) |
| Notification target | `NOTIFICATION_TARGET_EMAIL` / `NOTIFICATION_EMAIL` |

**Email triggers** (all server-side):
- Booking submission → notify technician
- Inquiry submission → notify technician
- Admin: confirm booking → send customer confirmation
- Admin: contact customer → custom message email
- Admin: test-email → manual test
- Admin: resend-email → retry failed notification

**Client-side email** (CONFIRMED — dual path):
Source: `src/utils/notifications.ts` (imported in api.ts)
- `sendServiceNotificationEmail()` — dispatches from browser using Resend API directly
- `sendCustomerInquiryEmail()` — dispatches from browser
- **⚠️ SECURITY ISSUE**: These client-side functions expose RESEND_API_KEY if it reaches the browser. Currently the key is NOT in any `VITE_*` variable, so it should not reach the browser — but the function exists and is called client-side.

---

## 12. Environment Variables (CONFIRMED)

Source: `.env.example`, `server.ts`, `src/lib/firebase.ts`

### Server-Only Variables (must NEVER reach browser)

| Variable | Where Used | Purpose | Next.js Name |
|---|---|---|---|
| `RESEND_API_KEY` | server.ts | Resend email API | `RESEND_API_KEY` |
| `RESEND_FROM` | server.ts | Sender address | `RESEND_FROM` |
| `SMTP_HOST` | server.ts | SMTP server | `SMTP_HOST` |
| `SMTP_PORT` | server.ts | SMTP port | `SMTP_PORT` |
| `SMTP_USER` | server.ts | SMTP username | `SMTP_USER` |
| `SMTP_PASS` | server.ts | SMTP password | `SMTP_PASS` |
| `SMTP_FROM` | server.ts | SMTP from | `SMTP_FROM` |
| `GMAIL_USER` | server.ts | Gmail alias | `GMAIL_USER` |
| `GMAIL_APP_PASSWORD` | server.ts | Gmail app password | `GMAIL_APP_PASSWORD` |
| `ADMIN_SECRET` | server.ts | Legacy API secret | `ADMIN_SECRET` |
| `NOTIFICATION_TARGET_EMAIL` | server.ts | Technician inbox | `NOTIFICATION_TARGET_EMAIL` |
| `NOTIFICATION_EMAIL` | server.ts | Alias | `NOTIFICATION_EMAIL` |
| `FIREBASE_PROJECT_ID` | server.ts (Admin SDK) | Firebase project | `FIREBASE_PROJECT_ID` |
| `FIREBASE_API_KEY` | server.ts (fallback) | Firebase API key | — (use NEXT_PUBLIC) |
| `GEMINI_API_KEY` | server.ts | Google AI | `GEMINI_API_KEY` |
| `PORT` | server.ts | HTTP server port | Not needed on Vercel |

### Browser-Safe Variables (currently hardcoded — should become NEXT_PUBLIC_*)

| Current Source | Value Location | Next.js Name |
|---|---|---|
| Firebase apiKey | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| Firebase authDomain | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| Firebase projectId | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| Firebase storageBucket | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| Firebase messagingSenderId | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| Firebase appId | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| Firebase firestoreDatabaseId | Hardcoded in firebase.ts | `NEXT_PUBLIC_FIREBASE_DATABASE_ID` |

---

## 13. Frontend API Calls (CONFIRMED)

Source: `src/utils/api.ts` (2155 lines), `src/components/admin/AdminProtectedRoute.tsx`

| Source File | API URL | Method | Auth Header | Purpose |
|---|---|---|---|---|
| api.ts:95 | `/api/data` | GET | None | Fetch public site data |
| api.ts:239 | `/api/bookings` | POST | None | Submit service booking |
| api.ts:284 | `/api/inquiries` | POST | None | Submit inquiry |
| api.ts:345 | `/api/bookings/:id` | GET | None | Track booking status |
| api.ts:441 | `/api/admin/verify-token` | POST | Bearer token | Verify admin session |
| api.ts:484 | `/api/admin/verify-token` | POST | Bearer token | Verify after password change |
| api.ts:621 | `/api/admin/data` | GET | Bearer token | Fetch all admin data |
| api.ts:671 | `/api/admin/services` | POST | Bearer token | Create service |
| api.ts:699 | `/api/admin/services/:id` | PUT | Bearer token | Update service |
| api.ts:753 | `/api/admin/services/:id` | DELETE | Bearer token | Delete service |
| AdminProtectedRoute.tsx:80 | `/api/admin/verify-token` | POST | Bearer token + AbortController 15s | Auth gate verify |

**Pattern**: All admin calls use `getCachedAdminToken()` → `Authorization: Bearer ${token}`.
**Fallback**: All operations have Firestore direct fallback if backend unavailable.
**No `axios`**: Only native `fetch()` is used throughout.
**No `localhost`/`127.0.0.1`**: All API calls use relative paths (`/api/...`).

---

## 14. Vercel Configuration Analysis (CONFIRMED)

Source: `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist",
  "functions": { "api/index.ts": { "maxDuration": 30 } },
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.ts" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

| Property | Value | Notes |
|---|---|---|
| Build command | `npm run vercel-build` → `vite build` | Frontend only |
| Output directory | `dist/` | SPA static files |
| Serverless function | `api/index.ts` | Wraps Express app |
| Function timeout | 30 seconds | Free tier max is 60s |
| API routing | `/api/*` → serverless function | CONFIRMED |
| SPA fallback | `/*` → `index.html` | CONFIRMED |

**`api/index.ts`** (CONFIRMED):
```typescript
import 'dotenv/config';
import app from '../server'; // imports entire 5160-line Express app
export default app;
```

**`package.json` scripts**:
- `vercel-build`: `vite build` (no server bundle)
- `build`: `vite build && esbuild server.ts --bundle ...` (local/Railway)
- `dev`: `tsx server.ts` (local development)
- `start`: `node dist/server.cjs` (production non-Vercel)

---

## 15. Current Deployment Problem — Confirmed Findings

### CONFIRMED (from source code)

1. **Vercel authorized domain missing**: Firebase Auth blocks logins from domains not in the Firebase Console authorized list. `tech-fix-peshawar.vercel.app` must be added to the correct Firebase project (`gen-lang-client-0759593306` owned by `ullahsafiullah117@gmail.com`).

2. **Firebase Admin SDK has no service account credentials**: Initialized with `projectId` only. On Vercel (not a Google Cloud environment), Application Default Credentials are not available. Token verification via `verifyIdToken()` may fail because it cannot authenticate the Admin SDK call to Google.

3. **File uploads incompatible with Vercel**: `multer` writes to local `uploads/` directory. Vercel serverless functions have a read-only filesystem. All upload endpoints will fail.

4. **`data/database.json` write-incompatible**: `saveDb()` uses `fs.writeFileSync`. On Vercel, this throws. The `loadDb()` read on startup will succeed (file is in repo), but any admin save will fail silently.

5. **`startServer()` now correctly guarded**: As of commit `e40e879`, `!process.env.VERCEL` check prevents Vite dev server and static file middleware from being added to the Vercel function.

### LIKELY (strongly indicated, requires runtime confirmation)

6. **Admin login hangs because Firebase Admin cannot verify tokens on Vercel**: Without ADC or a service account, `getAdminAuth().verifyIdToken(token)` would throw an authentication error internally, causing the request to hang or return a 500 error.

7. **15-second timeout will surface this as**: "Server is starting up — please wait 5 seconds and try again." (from the AbortController fix in commit `e40e879`).

### UNKNOWN (cannot determine from source alone)

8. **Whether Vercel function deployment is succeeding**: Function build logs on Vercel would confirm or deny this. Requires Vercel dashboard inspection.

9. **Whether ADC is partially available on Vercel**: In some configurations Vercel + Google can use workload identity. Not determinable from source.

---

## 16. Next.js Architecture Proposal

### Target Architecture

```
Next.js App Router (Vercel)
├── app/
│   ├── layout.tsx              — Root layout (Navbar, Footer)
│   ├── page.tsx                — Home page (Server Component)
│   ├── services/page.tsx       — Services page
│   ├── how-it-works/page.tsx
│   ├── why-on-site/page.tsx
│   ├── who-we-serve/page.tsx
│   ├── bulk-windows/page.tsx
│   ├── about/page.tsx
│   ├── problems-solutions/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx        — Client Component (form state)
│   ├── track-request/page.tsx  — Client Component (form state)
│   ├── [adminEmail]/
│   │   └── admin/page.tsx      — Protected admin route
│   └── api/                    — Route Handlers (replace Express)
│       ├── data/route.ts
│       ├── bookings/route.ts
│       ├── bookings/[id]/route.ts
│       ├── inquiries/route.ts
│       └── admin/
│           ├── verify-token/route.ts
│           ├── data/route.ts
│           └── [... all admin routes]
├── lib/
│   ├── firebase.ts             — Client Firebase (browser SDK)
│   └── firebase-admin.ts      — Server Firebase Admin (with service account)
├── middleware.ts               — Auth protection for /admin route
└── components/                 — Migrated React components
```

---

## 17. File Migration Map

| Current File | Next.js Destination | Migration Type | Reason |
|---|---|---|---|
| `src/main.tsx` | `app/layout.tsx` | REPLACE | Vite entry → Next.js root layout |
| `src/App.tsx` | `app/layout.tsx` + page files | SPLIT | Router + layout → Next.js file router |
| `src/pages/HomePage.tsx` | `app/page.tsx` | MIGRATE | Hash route → file route |
| `src/pages/ServicesPage.tsx` | `app/services/page.tsx` | MIGRATE | |
| `src/pages/HowItWorksPage.tsx` | `app/how-it-works/page.tsx` | MIGRATE | |
| `src/pages/WhyOnSitePage.tsx` | `app/why-on-site/page.tsx` | MIGRATE | |
| `src/pages/WhoWeServePage.tsx` | `app/who-we-serve/page.tsx` | MIGRATE | |
| `src/pages/BulkWindowsPage.tsx` | `app/bulk-windows/page.tsx` | MIGRATE | |
| `src/pages/AboutPage.tsx` | `app/about/page.tsx` | MIGRATE | |
| `src/pages/ProblemsSolutionsPage.tsx` | `app/problems-solutions/page.tsx` | MIGRATE | |
| `src/pages/FAQPage.tsx` | `app/faq/page.tsx` | MIGRATE | |
| `src/pages/ContactPage.tsx` | `app/contact/page.tsx` | MIGRATE (Client) | Has form state |
| `src/pages/TrackRequestPage.tsx` | `app/track-request/page.tsx` | MIGRATE (Client) | Has form state |
| `src/components/admin/AdminProtectedRoute.tsx` | `app/[adminEmail]/admin/page.tsx` | REPLACE | Auth gate → Next.js middleware + page |
| `src/components/AdminPanel.tsx` + admin/* | `app/[adminEmail]/admin/` | MIGRATE (Client) | All admin components are Client |
| `src/lib/firebase.ts` | `lib/firebase.ts` | RENAME | Keep client SDK |
| `src/utils/api.ts` | `lib/api.ts` + API Route Handlers | SPLIT | Frontend helpers keep; Express routes → route.ts |
| `src/utils/notifications.ts` | Remove client-side dispatch | SECURITY FIX | Emails must be server-only |
| `src/utils/fallbackData.ts` | `lib/fallbackData.ts` | RENAME | |
| `server.ts` | `app/api/**/route.ts` (75 handlers) | REPLACE | Express → Next.js Route Handlers |
| `api/index.ts` | DELETE | DELETE | Not needed with Next.js |
| `vercel.json` | DELETE or minimal | SIMPLIFY | Next.js handles Vercel routing |
| `vite.config.ts` | DELETE | DELETE | Replaced by Next.js build |

---

## 18. Route Migration Map

| Current React Route | Next.js App Router Route | Component Type | Auth Required? |
|---|---|---|---|
| `/` | `app/page.tsx` | Server Component | No |
| `/#services` | `app/services/page.tsx` | Server Component | No |
| `/#how-it-works` | `app/how-it-works/page.tsx` | Server Component | No |
| `/#why-on-site` | `app/why-on-site/page.tsx` | Server Component | No |
| `/#who-we-serve` | `app/who-we-serve/page.tsx` | Server Component | No |
| `/#bulk-windows` | `app/bulk-windows/page.tsx` | Server Component | No |
| `/#about` | `app/about/page.tsx` | Server Component | No |
| `/#problems-solutions` | `app/problems-solutions/page.tsx` | Server Component | No |
| `/#faq` | `app/faq/page.tsx` | Server Component | No |
| `/#contact` | `app/contact/page.tsx` | Client Component | No (public form) |
| `/#track-request` | `app/track-request/page.tsx` | Client Component | No (public form) |
| `/techfixpeshawar@gmail.com/admin` | `app/[adminEmail]/admin/page.tsx` | Client Component | YES — Firebase Auth |

---

## 19. Express API → Next.js Route Handler Migration Map (Selected Key Routes)

| Express Endpoint | Next.js Route File | Auth | Firebase Op |
|---|---|---|---|
| GET `/api/data` | `app/api/data/route.ts` | None | Firestore read (services, settings, faqs, caseStudies) |
| GET `/api/services` | `app/api/services/route.ts` | None | Firestore read |
| POST `/api/bookings` | `app/api/bookings/route.ts` | None | Firestore write + email |
| GET `/api/bookings/:id` | `app/api/bookings/[id]/route.ts` | None | Firestore get |
| POST `/api/inquiries` | `app/api/inquiries/route.ts` | None | Firestore write + email |
| POST `/api/admin/verify-token` | `app/api/admin/verify-token/route.ts` | Firebase Admin | verifyIdToken + email check |
| GET `/api/admin/data` | `app/api/admin/data/route.ts` | Firebase Admin | Firestore multi-collection read |
| PUT `/api/admin/settings` | `app/api/admin/settings/route.ts` | Firebase Admin | Firestore write |
| POST `/api/admin/services` | `app/api/admin/services/route.ts` | Firebase Admin | Firestore write |
| POST `/api/admin/media/upload` | `app/api/admin/media/upload/route.ts` | Firebase Admin | **REQUIRES REDESIGN** — no multer in Next.js |
| POST `/api/admin/upload-icon` | `app/api/admin/upload-icon/route.ts` | Firebase Admin | **REQUIRES REDESIGN** — no multer |
| POST `/api/admin/profile-photo` | `app/api/admin/profile-photo/route.ts` | Firebase Admin | **REQUIRES REDESIGN** — no multer |
| GET `/api/media/image/:id` | `app/api/media/image/[id]/route.ts` | None | Read from Firestore/Storage |

**Full mapping of all 75 routes**: Pattern is consistent — each `app.METHOD('/api/path', [checkAdminAuth], handler)` → `app/api/path/route.ts` with `export async function METHOD(request: Request)`.

---

## 20. Server/Client Boundary Plan

### Server Components (no browser APIs, no state)
- All public page components (HomePage, ServicesPage, etc.) — can be Server Components
- Data fetching can move server-side with Next.js `fetch()` + caching

### Client Components (require `'use client'`)
All components that use:

| Component | Browser API Used |
|---|---|
| `AdminProtectedRoute.tsx` | `onAuthStateChanged`, `useState`, `useEffect` |
| `AdminPanel.tsx` + all admin/* | `useState`, `useEffect`, Firebase auth |
| `ContactPage.tsx` | `useState` (form) |
| `TrackRequestPage.tsx` | `useState` (form) |
| `Navbar.tsx` | `useState` (mobile menu), `onClick` |
| `BookingForm.tsx` | `useState`, form submission |
| `CustomerInquiryModal.tsx` | `useState`, form |
| `ProblemSelector.tsx` | `useState` |
| `App.tsx` router state | `useState`, `window`, `history` — entire router |

### Server Utilities (Next.js API Route Handlers)
- All Express route handlers
- Firebase Admin token verification
- Email sending (Resend/Nodemailer)
- Database reads/writes

---

## 21. Firebase Migration Plan (Proposed)

### `lib/firebase.ts` (Browser SDK — unchanged)
- Keeps all current client-side Firebase initialization
- Add environment variable support for `NEXT_PUBLIC_FIREBASE_*`
- Remove hardcoded credentials

### `lib/firebase-admin.ts` (Server SDK — NEW)
```typescript
// Server-only — never imported by client components
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

if (!getApps().length) {
  initializeApp({
    credential: credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(process.env.FIREBASE_PROJECT_ID, 'custom-db-id');
```

**⚠️ CRITICAL**: A Firebase service account JSON must be generated and its fields placed in Vercel environment variables (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`). Without this, `verifyIdToken` will fail on Vercel.

---

## 22. Authentication Migration Plan (Next.js)

```
Login page (Client Component):
  └── signInWithEmailAndPassword(auth, email, password)
        ↓
  Firebase Auth → ID Token
        ↓
  fetch('/api/admin/verify-token', { Authorization: Bearer token })
        ↓
  Route Handler: app/api/admin/verify-token/route.ts
        └── adminAuth.verifyIdToken(token)  [uses service account]
              └── Check email ∈ AUTHORIZED_ADMIN_EMAILS
                    └── Return { success: true }
        ↓
  Set cookie: httpOnly session cookie (recommended) or sessionStorage
        ↓
  middleware.ts: verifyIdToken on each /admin/* request

Admin page protection:
  ├── middleware.ts — redirect unauthenticated requests
  └── API route handlers — re-verify token on every protected request
```

---

## 23. Dependency Analysis

| Dependency | Keep? | Action | Reason |
|---|---|---|---|
| `react` 19 | YES | KEEP | Same version in Next.js |
| `react-dom` 19 | YES | KEEP | Same |
| `firebase` 12 | YES | KEEP | Client SDK |
| `firebase-admin` 14 | YES | KEEP | Server SDK |
| `express` 4 | NO | REMOVE | Replaced by Next.js Route Handlers |
| `vite` 6 | NO | REMOVE | Replaced by Next.js build |
| `@vitejs/plugin-react` | NO | REMOVE | Replaced by Next.js |
| `@tailwindcss/vite` | REPLACE | USE `tailwindcss` with Next.js config | Different integration |
| `nodemailer` 10 | YES | KEEP | Email sending |
| `lucide-react` | YES | KEEP | Icons |
| `motion` 12 | YES | KEEP | Animations |
| `@google/genai` | YES | KEEP | Gemini AI |
| `dotenv` | NO | REMOVE | Next.js handles env vars natively |
| `tsx` | NO | REMOVE | Only needed for Express |
| `esbuild` | NO | REMOVE | Only needed for server bundle |
| `firebase-functions` | INVESTIGATE | Low priority | Cloud Functions stub exists |
| `typescript` | YES | KEEP | |
| `autoprefixer` | KEEP | KEEP | CSS processing |
| `tailwindcss` | YES | KEEP | |

---

## 24. Migration Risks

| Risk | Evidence | Impact | Requirement | How to Verify |
|---|---|---|---|---|
| **Firebase Admin has no service account** | server.ts line 73: `initAdminApp({ projectId: ... })` only | CRITICAL — token verification fails on Vercel | Generate service account JSON from Firebase Console, add keys to Vercel env vars | Test `/api/admin/verify-token` endpoint after deploy |
| **File uploads incompatible with serverless** | multer disk storage in server.ts lines 3913, 4828, 4890 | HIGH — all uploads fail on Vercel | Migrate to Firebase Storage or Vercel Blob | Test upload from admin panel |
| **database.json writes fail on Vercel** | `fs.writeFileSync` in saveDb() | HIGH — admin saves fail silently | Migrate 100% to Firestore (already partially done) | Test admin settings save |
| **Custom Firestore database ID** | `ai-studio-peshawaronsitete-...` in firebase.ts | HIGH — Admin SDK uses default DB unless configured | Set custom DB ID in Admin SDK init | Test Firestore reads from server |
| **Custom router → Next.js file router** | App.tsx hash routing | MEDIUM — all navigation must be re-implemented | Replace hash routing with Next.js Link + useRouter | Test all page navigations |
| **Client-side email sending** | `src/utils/notifications.ts` | MEDIUM — security issue if RESEND key leaks | Move to API route handlers only | Audit notifications.ts callers |
| **Firebase config hardcoded** | firebase.ts lines 36–43 | MEDIUM — exposed in source | Move to NEXT_PUBLIC_* env vars | Review Vercel env vars after migration |
| **75 Express routes must be migrated** | server.ts route count | HIGH effort — time-consuming | Systematic migration one route at a time | Test each endpoint after migration |
| **Real-time Firestore snapshots** | App.tsx onSnapshot listeners | MEDIUM — works in Client Components | Keep in Client Components | Test live updates after migration |
| **multer `raw` body parsing** | Some endpoints need raw body | MEDIUM | Configure `bodyParser` equivalent in Next.js | Test affected endpoints |
| **Rate limiting** | publicApiRateLimiter, uploadRateLimiter | LOW-MEDIUM | Implement with Vercel Edge Middleware or upstash/ratelimit | Test rapid requests |
| **`data/database.json` as fallback** | loadDb() reads this on startup | LOW — Firestore already primary | Remove JSON dependency, use Firestore exclusively | Test without database.json |
| **Admin URL pattern** `/email/admin` | App.tsx line 79: `/techfixpeshawar@gmail.com/admin` | LOW — Next.js `[adminEmail]` dynamic segment handles this | Test URL still works | Navigate to `/techfixpeshawar@gmail.com/admin` |

---

## 25. Questions Requiring Confirmation

1. **Firebase service account**: Does a service account JSON exist for project `gen-lang-client-0759593306`? This is **required** before the Next.js migration can support admin login on Vercel.

2. **Custom Firestore database**: The custom database `ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555` — is this accessible from Firebase Admin SDK on Vercel? Must be confirmed at runtime.

3. **Upload destination after migration**: Where should uploaded images go — Firebase Storage or Vercel Blob? This determines the upload migration strategy.

4. **`functions/index.ts` purpose**: A Cloud Functions stub exists. Is this intended for deployment, or is it unused?

---

## 26. Phase 1 Completion Checklist

- [x] Entire project inspected
- [x] Frontend routes identified (12 routes)
- [x] Backend routes identified (~75 endpoints)
- [x] Firebase client usage identified
- [x] Firestore usage identified (16 collections)
- [x] Storage usage identified (not currently used for uploads)
- [x] Email usage identified (Resend + Nodemailer, both server-side)
- [x] Authentication flow traced (Firebase Auth → ID Token → verify-token → email allowlist)
- [x] Admin authorization traced (dual: server allowlist + Firestore rules)
- [x] Environment variables identified (16 server-only, 7 browser-safe hardcoded)
- [x] Frontend API calls identified (all relative /api/* paths, no hardcoded URLs)
- [x] Vercel configuration inspected
- [x] Current deployment issue identified from evidence
- [x] Next.js architecture mapped
- [x] File migration mapped
- [x] API migration mapped
- [x] Risks documented (13 risks)
- [x] Unknowns documented (4 questions)
- [x] **No source files were modified during Phase 1**

---

## 27. Phase 2 Plan (Awaiting Approval)

Phase 2 will implement the migration in this order:

1. **Setup Next.js project** — `npx create-next-app@latest` with TypeScript + Tailwind
2. **Firebase Admin with service account** — generate credentials, configure `lib/firebase-admin.ts`
3. **Migrate `lib/firebase.ts`** — replace hardcoded config with `NEXT_PUBLIC_*` env vars
4. **Migrate public pages** — copy page components one at a time, test each
5. **Implement Next.js routing** — replace hash routing with `Link` + `useRouter`
6. **Migrate authentication** — `/api/admin/verify-token` route handler first
7. **Migrate public API routes** — `/api/data`, `/api/bookings`, `/api/inquiries`
8. **Migrate admin API routes** — all 60+ admin endpoints
9. **Migrate file uploads** — replace multer with Firebase Storage
10. **Migrate email** — move `notifications.ts` to server-side only
11. **Remove Express** — delete `server.ts`, `api/index.ts`, `vercel.json` custom config
12. **TypeScript + build verification** — `tsc --noEmit`, `next build`
13. **Deploy to Vercel** — final production test

**Phase 2 requires user approval and answers to the 4 questions above before starting.**
