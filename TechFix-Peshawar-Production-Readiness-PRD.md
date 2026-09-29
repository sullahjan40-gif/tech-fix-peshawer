# TechFix Peshawar

## Production Readiness & Comprehensive Bug Remediation PRD

**Document Version:** 1.0
**Project:** TechFix Peshawar
**Purpose:** Resolve the identified security, authentication, data, API, persistence, upload, email, frontend, backend, and deployment defects before production release.

---

# 1. Product Objective

The objective of this project is to transform the current TechFix Peshawar application into a:

* Secure production-ready application
* Reliable customer booking and inquiry system
* Secure administrator dashboard
* Consistent Firebase/backend architecture
* Reliable notification and email system
* Validated and maintainable API
* Stable data-storage system
* Properly debuggable development environment
* Type-safe and testable codebase

The audit identified **250 separate findings** covering security, authentication, authorization, data exposure, persistence, API validation, file handling, email delivery, frontend state, TypeScript, deployment, and debugging.

The fixes must be implemented in controlled phases rather than modifying all 250 issues simultaneously.

---

# 2. Critical Business Goals

## 2.1 Security

Prevent:

* Unauthorized administrator access
* Admin privilege escalation
* Customer-data exposure
* Credential leakage
* Public database access
* Unauthorized deletion/modification
* Upload path traversal
* Email abuse
* API abuse

## 2.2 Reliability

Ensure:

* Bookings are never silently lost
* Customer inquiries persist reliably
* Database writes are atomic
* Email failures are detectable
* Duplicate submissions are controlled
* Application state has one authoritative source

## 2.3 Maintainability

Ensure:

* TypeScript catches invalid code
* API requests have schemas
* Authentication uses one architecture
* Database entities have defined types
* Secrets are separated from application data
* Tests cover critical workflows

## 2.4 Deployment Readiness

Ensure:

* Production configuration is environment-driven
* Local development works correctly
* VS Code debugging works
* Build/start commands are correct
* No stale generated files are deployed
* Production persistence does not depend on ephemeral local files

---

# 3. Scope

## In Scope

### Authentication

* Admin login
* Admin sessions
* Firebase authentication
* Admin roles
* Password management
* Token validation
* Logout

### Authorization

* Firestore security rules
* Express API authorization
* Admin-only endpoints
* Customer tracking access

### Customer Data

* Bookings
* Inquiries
* Customers
* Leads
* Activity logs
* Tracking information

### Backend

* Express server
* API validation
* Error handling
* Rate limiting
* Persistence
* Database architecture

### Frontend

* Admin dashboard
* Authentication state
* API client
* Firestore listeners
* Routing
* Settings
* Notifications

### Media

* Image uploads
* Technician photos
* CMS media
* File validation
* File deletion

### Email

* Resend
* SMTP
* EmailJS
* FormSubmit fallback
* Customer confirmations
* Technician notifications

### Development

* TypeScript
* VS Code debugger
* Vite
* Build system
* npm scripts
* README

---

# 4. Out of Scope

The following should not be changed unless required by a security or bug fix:

* Existing website branding
* Existing visual design
* Existing service descriptions
* Existing customer-facing layout
* Existing business content
* Existing navigation structure

The goal is **bug remediation without unnecessary redesign**.

---

# 5. Priority Classification

## P0 — Critical

Must be fixed before production.

Includes:

* Credential exposure
* Admin authentication bypass
* Admin privilege escalation
* Public customer data
* Public admin endpoints
* Public email relay
* Upload path traversal
* Public private settings
* Unsafe password handling
* Broken authorization architecture

Relevant findings include:

**BUG-001 through BUG-025**, plus related authentication/security findings throughout the audit.

---

# 6. P1 — High

Must be fixed before production or immediately before public launch.

Includes:

* Database reliability
* API validation
* Email security
* File upload security
* Firestore authorization
* Customer-data protection
* Duplicate bookings
* Notification reliability
* Persistence architecture

Relevant findings include:

**BUG-026 through BUG-60**, plus the remaining HIGH findings.

---

# 7. P2 — Medium

Should be completed before final production release.

Includes:

* TypeScript improvements
* Routing corrections
* debugger configuration
* logging
* UI state handling
* cache handling
* deployment configuration
* code quality

---

# 8. Functional Requirements

## FR-001 — Secure Administrator Authentication

The system SHALL provide secure administrator authentication.

Requirements:

1. No hardcoded admin passwords.
2. No default passwords.
3. No password stored in localStorage.
4. No plaintext password stored in Firestore.
5. No authentication based on token length.
6. No development authentication bypass in production.
7. Authentication tokens must expire.
8. Invalid tokens must return HTTP 401.
9. Password comparison must be exact and secure.
10. Authentication must use one authoritative mechanism.

Related:

* BUG-005
* BUG-006
* BUG-007
* BUG-008
* BUG-009
* BUG-010
* BUG-011
* BUG-146
* BUG-147
* BUG-148
* BUG-149
* BUG-150

### Acceptance Criteria

* Incorrect password cannot access admin.
* Random 20+ character strings cannot authenticate.
* Missing Authorization header cannot authenticate.
* Restarting the server does not create or destroy authentication configuration unexpectedly.
* Admin sessions expire.
* No password appears in browser localStorage.
* No plaintext password exists in Firestore.

---

# 9. FR-002 — Unified Authorization Architecture

The system SHALL use one authoritative authorization architecture.

Preferred architecture:

**Firebase Authentication → Firebase ID Token → Express verification → Admin claims/authorization**

or another equally secure single architecture.

The system must not maintain competing:

* Express custom tokens
* Firebase roles
* localStorage admin sessions
* hardcoded admin emails
* Firestore self-assigned roles

Related:

* BUG-159
* BUG-160
* BUG-161
* BUG-246
* BUG-247
* BUG-248
* BUG-249

### Acceptance Criteria

A user who is not an administrator cannot access any admin API even if:

* They modify localStorage.
* They modify frontend JavaScript.
* They modify Firestore user documents.
* They create a fake token.
* They change their email.
* They manipulate browser state.

---

# 10. FR-003 — Secure Firestore Rules

Firestore rules SHALL prevent privilege escalation and unauthorized access.

Requirements:

* Users cannot assign themselves admin roles.
* Users cannot modify privileged fields.
* Public users cannot read private settings.
* Public users cannot read customer records.
* Public users cannot create fake audit logs.
* Admin authorization must not depend on a mutable user document.
* Private collections must require verified admin authorization.

Related:

* BUG-013
* BUG-014
* BUG-079
* BUG-080
* BUG-081
* BUG-082
* BUG-083
* BUG-084
* BUG-241
* BUG-242
* BUG-243
* BUG-244

---

# 11. FR-004 — Customer Data Protection

Customer information SHALL never be publicly exposed.

Protected information includes:

* Name
* Phone
* Email
* Address
* Booking information
* Inquiry details
* Customer notes
* Internal activity
* Lead information

Public tracking must expose only the minimum information required.

### Acceptance Criteria

Anonymous users cannot:

* Download all inquiries.
* Download all customers.
* Delete inquiries.
* Read private booking fields.
* Read internal notes.
* Read admin configuration.

---

# 12. FR-005 — Secure Booking Tracking

Booking tracking SHALL use secure verification.

The current phone-based partial matching approach must be replaced.

Requirements:

* Use a secure booking reference.
* Use a signed token or secondary verification factor.
* Normalize phone numbers.
* Do not expose the complete booking object.
* Return a dedicated sanitized tracking response.

Related:

* BUG-019
* BUG-153
* BUG-154
* BUG-221
* BUG-222

---

# 13. FR-006 — Secure API Architecture

All API endpoints SHALL have:

* Authentication where required
* Authorization where required
* Request validation
* Response validation where necessary
* Maximum field lengths
* Enum validation
* Error handling
* Rate limiting
* Appropriate HTTP status codes

Use runtime validation such as:

* Zod
* Valibot
* Joi

or an equivalent schema-validation library.

---

# 14. FR-007 — Public Form Protection

Public forms SHALL protect against abuse.

Applicable forms:

* Booking
* Contact/inquiry
* Problem report
* Service request

Requirements:

* Maximum request size
* Maximum field length
* Email validation
* Phone validation
* Date validation
* Enum validation
* Rate limiting
* Anti-bot protection where appropriate
* Idempotency key

Related:

* BUG-086
* BUG-087
* BUG-088
* BUG-184
* BUG-225
* BUG-226
* BUG-228

---

# 15. FR-008 — Reliable Data Persistence

The application SHALL use one authoritative production datastore.

The current mixture of:

**local database.json + Firestore settings**

must be eliminated or clearly separated.

The production architecture must not depend on:

* local JSON persistence
* ephemeral filesystem
* synchronous database file writes
* accidental database reset

Related:

* BUG-052
* BUG-053
* BUG-054
* BUG-055
* BUG-120
* BUG-121
* BUG-122
* BUG-237
* BUG-238

---

# 16. FR-009 — Database Transactions

The following operations should be atomic:

### Booking

Booking creation → customer update → lead creation → activity log

### Inquiry

Inquiry creation → customer update → activity log

### Problem Report

Lead creation → customer update → notification status

If a notification fails, the customer record must still exist.

---

# 17. FR-010 — Duplicate Submission Protection

The system SHALL prevent duplicate submissions.

Requirements:

* Client generates idempotency key.
* Server validates key.
* Duplicate key returns the original operation result.
* Multiple clicks must not create multiple bookings.
* Email notifications must not be duplicated.

Related:

* BUG-093
* BUG-094
* BUG-184
* BUG-193
* BUG-194

---

# 18. FR-011 — Secure File Uploads

All uploads SHALL be securely validated.

Requirements:

* Validate MIME type.
* Validate magic bytes.
* Validate image dimensions.
* Validate decoded size.
* Generate random filenames.
* Reject path traversal.
* Never trust client filename.
* Store files outside the application database.
* Delete physical files when media records are deleted.

Related:

* BUG-027
* BUG-028
* BUG-029
* BUG-030
* BUG-031
* BUG-032
* BUG-033
* BUG-034
* BUG-119
* BUG-120
* BUG-208
* BUG-209
* BUG-210
* BUG-211
* BUG-212
* BUG-213

---

# 19. FR-012 — Media Storage

Images SHALL NOT be stored as large base64 strings inside the main database.

Preferred structure:

```text
Database
  └── media record
       ├── id
       ├── filename
       ├── mimeType
       ├── size
       └── storageUrl
```

Actual image:

```text
Object Storage
    └── generated-random-filename.webp/jpg/png
```

---

# 20. FR-013 — Secure Email Architecture

Email delivery SHALL occur server-side.

The frontend must not directly control:

* Email provider credentials
* SMTP credentials
* API keys
* Recipient destinations
* Provider selection

Remove unnecessary browser-side email delivery.

Related:

* BUG-036
* BUG-037
* BUG-038
* BUG-039
* BUG-040
* BUG-041
* BUG-141
* BUG-142
* BUG-143
* BUG-144
* BUG-217
* BUG-218

---

# 21. FR-014 — Email HTML Security

Every customer-controlled value inserted into HTML email must be escaped.

Fields include:

* Name
* Email
* Phone
* Address
* Message
* Service
* Problem description

No raw customer value may be inserted directly into HTML.

---

# 22. FR-015 — Email Delivery Status

Email status SHALL represent the actual provider result.

Valid states:

```text
queued
sending
sent
failed
retrying
```

The system must never record:

```text
sent
```

before successful provider confirmation.

Related:

* BUG-042
* BUG-043
* BUG-095
* BUG-096
* BUG-097
* BUG-098
* BUG-188
* BUG-198

---

# 23. FR-016 — Email Retry System

Failed notifications SHALL support controlled retries.

Requirements:

* Retry with exponential backoff.
* Prevent duplicate messages.
* Store provider message ID where available.
* Record failure reason.
* Stop after maximum retry attempts.
* Show failed notifications to administrators.

---

# 24. FR-017 — Secrets Management

No secrets may exist in:

* Source code
* `.env.example`
* Firestore public documents
* `database.json`
* Frontend JavaScript
* localStorage
* README
* Git history

Secrets must be supplied through secure environment/secret management.

Previously exposed credentials must be rotated.

Related:

* BUG-001
* BUG-002
* BUG-003
* BUG-004
* BUG-035
* BUG-214

---

# 25. FR-018 — Admin Settings Security

CMS settings SHALL be divided into:

### Public settings

Examples:

* Business name
* Phone
* Address
* Opening hours
* Public social links

### Private settings

Examples:

* API keys
* SMTP credentials
* Admin configuration
* Notification credentials

Private settings must never be returned through public API endpoints.

---

# 26. FR-019 — CMS Validation

CMS APIs SHALL use explicit schemas.

The system must reject:

* Unknown fields
* Invalid status values
* Invalid collection names
* Invalid service IDs
* Duplicate ordering values
* Oversized content
* Invalid media references

Related:

* BUG-105
* BUG-106
* BUG-107
* BUG-108
* BUG-109
* BUG-110
* BUG-111
* BUG-114
* BUG-115
* BUG-116
* BUG-117
* BUG-118

---

# 27. FR-020 — TypeScript Safety

The project SHALL enable strict TypeScript checking.

Target:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Then remove unsafe `any` usage progressively.

Critical areas:

* Authentication
* API requests
* Database
* Firestore
* Booking
* Inquiry
* Media
* Email

Related:

* BUG-070
* BUG-071
* BUG-072
* BUG-133
* BUG-223
* BUG-224

---

# 28. FR-021 — Centralized Error Handling

Express SHALL have centralized error handling.

Every unexpected server error should:

1. Generate/request a correlation ID.
2. Log server-side details.
3. Return safe client-facing JSON.
4. Avoid exposing stack traces.
5. Return an appropriate HTTP status.

Related:

* BUG-202
* BUG-203
* BUG-204

---

# 29. FR-022 — Rate Limiting

Rate limiting SHALL be implemented for:

* Login
* Booking
* Inquiry
* Tracking lookup
* Email sending
* Uploads
* Password changes
* Admin operations

The production implementation must work across multiple server instances.

A process-local JavaScript object is insufficient for distributed deployment.

---

# 30. FR-023 — Frontend Authentication State

The frontend SHALL not independently decide whether a user is an administrator.

Frontend state should represent verified server/Firebase authentication.

Remove:

* Fake session tokens
* Passwords in localStorage
* Hardcoded admin emails
* Client-created admin accounts
* Client-side role escalation

---

# 31. FR-024 — Frontend Data Consistency

The application currently has competing data sources.

Potential sources include:

* Express API
* Firestore listeners
* localStorage
* default data
* cached settings

A single authoritative source must be selected.

Fallback data may be used only for:

* temporary offline UI
* initial loading
* explicit demo mode

Fallback data must never silently override valid production data.

Related:

* BUG-169
* BUG-170
* BUG-171
* BUG-173
* BUG-174

---

# 32. FR-025 — Routing

Frontend routing SHALL correctly support:

* Direct URL navigation
* Back button
* Forward button
* Hash changes where used
* pushState
* refresh
* deep links

Fix the current mismatch between:

* `pushState`
* `hashchange`
* `popstate`

Related:

* BUG-062
* BUG-175
* BUG-176
* BUG-177

---

# 33. FR-026 — VS Code Debugging

The project SHALL support debugging both:

### Frontend

Chrome/Edge browser debugger.

### Backend

Node/tsx server debugger.

The current debugger configuration pointing to port **8080** must be corrected to the actual application port or made configurable.

Live Server should not be used as the primary development server for this full-stack application.

Related:

* BUG-063
* BUG-128
* BUG-129
* BUG-130

---

# 34. FR-027 — Build & Deployment

The project SHALL have:

```text
npm install / npm ci
npm run typecheck
npm run build
npm start
```

working consistently.

Generated files such as `dist/` should be produced by the build process rather than treated as authoritative source.

---

# 35. FR-028 — Configuration

The server SHALL respect:

```text
PORT
NODE_ENV
Firebase configuration
email provider configuration
database configuration
storage configuration
```

Do not hardcode production configuration.

Related:

* BUG-123
* BUG-124
* BUG-125
* BUG-164
* BUG-195
* BUG-196
* BUG-197

---

# 36. FR-029 — Security Headers

Security headers SHALL be reviewed and configured appropriately.

Current CSP weaknesses involving:

```text
unsafe-inline
unsafe-eval
```

must be reduced or removed where technically possible.

HSTS must only be enabled appropriately for HTTPS production.

Related:

* BUG-199
* BUG-200
* BUG-201

---

# 37. FR-030 — Documentation

README SHALL document:

1. Project requirements
2. Installation
3. Environment variables
4. Firebase setup
5. Database setup
6. Email configuration
7. Storage configuration
8. Development commands
9. Debugging
10. Production build
11. Deployment
12. Security requirements

All Git merge-conflict markers must be removed.

Related:

* BUG-066
* BUG-135
* BUG-136

---

# 38. Non-Functional Requirements

## Security

* No critical authentication bypasses.
* No public customer records.
* No plaintext credentials.
* No exposed API keys.
* No path traversal.
* No self-service admin escalation.

## Performance

* Avoid synchronous large JSON writes.
* Avoid sending huge base64 payloads.
* Paginate large collections.
* Use object storage for media.
* Use asynchronous notification queues.

## Reliability

* Database operations must be durable.
* Email failures must not lose customer records.
* Duplicate submissions must be controlled.
* Failed operations must be observable.

## Maintainability

* Strict TypeScript.
* Shared types/schemas.
* Centralized authentication.
* Centralized API client.
* Centralized error handling.
* Automated tests.

---

# 39. Testing Requirements

## Authentication Tests

Test:

* Correct password
* Incorrect password
* Empty password
* Expired token
* Fake token
* Long random token
* Missing token
* Normal user accessing admin API
* Admin accessing admin API
* Logout
* Session expiration

## Authorization Tests

Test:

* Public → private API
* User → admin API
* User → role modification
* User → activity log creation
* User → customer data
* User → inquiry deletion

## Booking Tests

Test:

* Valid booking
* Invalid email
* Invalid phone
* Invalid date
* Invalid urgency
* Oversized fields
* Duplicate submission
* Concurrent submission

## Upload Tests

Test:

* Valid image
* Invalid MIME type
* Fake image extension
* Oversized image
* Path traversal filename
* Duplicate filename
* Delete media
* Missing media

## Email Tests

Test:

* Successful email
* Provider failure
* Timeout
* Retry
* Duplicate retry
* HTML escaping
* Invalid recipient
* Customer confirmation
* Technician notification

## Database Tests

Test:

* Normal write
* Concurrent write
* Corrupt data
* Missing collection
* Backup
* Recovery
* Migration
* Reset

---

# 40. Deployment Acceptance Checklist

The application cannot be considered production-ready until all of the following are true:

* [ ] All exposed credentials rotated.
* [ ] No credentials in source.
* [ ] No credentials in Git history.
* [ ] Admin authentication secured.
* [ ] Admin authorization unified.
* [ ] Firestore rules secured.
* [ ] Customer data protected.
* [ ] Public APIs reviewed.
* [ ] Email relay closed.
* [ ] Upload traversal fixed.
* [ ] File validation implemented.
* [ ] Database architecture finalized.
* [ ] Media storage finalized.
* [ ] API schemas implemented.
* [ ] Rate limiting implemented.
* [ ] Idempotency implemented.
* [ ] Email retries implemented.
* [ ] TypeScript strict mode enabled.
* [ ] Tests passing.
* [ ] Build passing.
* [ ] VS Code debugging working.
* [ ] README corrected.
* [ ] Git conflict markers removed.
* [ ] Production environment variables configured.
* [ ] Security headers reviewed.
* [ ] Logging/correlation IDs implemented.
* [ ] No critical or high-severity unresolved findings.

---

# 41. Implementation Phases

## Phase 0 — Credential Emergency

Fix:

* BUG-001
* BUG-002
* BUG-003
* BUG-004
* BUG-214

Actions:

1. Rotate all exposed credentials.
2. Remove credentials from source.
3. Remove credentials from database.
4. Remove credentials from frontend.
5. Clean Git history where required.

---

## Phase 1 — Authentication & Authorization

Fix all authentication/authorization findings.

Primary targets:

* BUG-005 → BUG-015
* BUG-159 → BUG-168
* BUG-246 → BUG-249

Deliverable:

**One secure authentication and authorization architecture.**

---

## Phase 2 — Customer Data Protection

Fix:

* BUG-016 → BUG-025
* BUG-151
* BUG-153
* BUG-154
* BUG-155
* BUG-156
* BUG-245

Deliverable:

**No unauthorized customer data exposure.**

---

## Phase 3 — Database & Persistence

Fix:

* BUG-051 → BUG-058
* BUG-119 → BUG-122
* BUG-181 → BUG-184
* BUG-230 → BUG-238

Deliverable:

**One reliable production datastore with safe transactions and migration.**

---

## Phase 4 — API Validation & Abuse Protection

Fix:

* BUG-086 → BUG-118
* BUG-140
* BUG-145
* BUG-184
* BUG-225 → BUG-228

Deliverable:

**Validated, rate-limited, abuse-resistant APIs.**

---

## Phase 5 — File & Media Security

Fix:

* BUG-027 → BUG-034
* BUG-119 → BUG-122
* BUG-208 → BUG-213

Deliverable:

**Secure media upload/storage system.**

---

## Phase 6 — Email & Notifications

Fix:

* BUG-036 → BUG-049
* BUG-095 → BUG-104
* BUG-139 → BUG-144
* BUG-187 → BUG-198
* BUG-217 → BUG-218

Deliverable:

**Reliable server-side notification system.**

---

## Phase 7 — Frontend & State

Fix:

* BUG-058
* BUG-060 → BUG-062
* BUG-169 → BUG-180
* BUG-220

Deliverable:

**Consistent frontend state and routing.**

---

## Phase 8 — TypeScript & Code Quality

Fix:

* BUG-070 → BUG-078
* BUG-223
* BUG-224

Deliverable:

**Strict, typed, maintainable codebase.**

---

## Phase 9 — Development & Deployment

Fix:

* BUG-063 → BUG-069
* BUG-123 → BUG-136
* BUG-199 → BUG-203

Deliverable:

**Reliable local development, debugging, build and deployment workflow.**

---

# 42. Definition of Done

A bug is considered complete only when:

1. Root cause is identified.
2. Code is changed.
3. Related callers are checked.
4. Regression test/check exists where appropriate.
5. TypeScript passes.
6. Build passes.
7. Relevant functionality is manually tested.
8. Security implications are checked.
9. No unrelated functionality is broken.
10. The corresponding BUG-ID is marked completed.

---

# 43. AI Coding Agent Rules

When using an AI coding agent to implement this PRD:

### DO

* Fix one bug/group at a time.
* Inspect existing code first.
* Trace callers before changing APIs.
* Preserve existing UI.
* Run tests after changes.
* Run typecheck.
* Run build.
* Report changed files.
* Report root cause.
* Report verification.
* Keep BUG-ID references.

### DO NOT

* Rewrite the entire application.
* Delete working features.
* Replace Firebase without approval.
* Change UI unnecessarily.
* Disable security rules to make errors disappear.
* Store passwords in localStorage.
* Add hardcoded credentials.
* Suppress TypeScript errors with `any`.
* Hide errors with empty catch blocks.
* Mark an issue fixed without testing.

---

# 44. Master AI Implementation Prompt

Use this prompt when giving the complete PRD to an AI coding agent:

> You are the senior software engineer responsible for making the TechFix Peshawar application production-ready.
>
> This project has an existing frontend, Express backend, Firebase/Firestore integration, admin dashboard, booking system, inquiry system, CMS, media uploads, and email notifications.
>
> A comprehensive audit identified 250 bugs/findings.
>
> Do NOT attempt to rewrite the entire application.
>
> Implement the remediation in phases.
>
> Start with P0 security issues, then P1 reliability issues, then P2 quality/debugging issues.
>
> Before modifying code:
>
> 1. Inspect the repository.
> 2. Identify the relevant BUG-ID.
> 3. Trace all callers and dependencies.
> 4. Determine the root cause.
> 5. Implement the smallest safe architectural fix.
>
> Security requirements:
>
> * No hardcoded credentials.
> * No plaintext passwords.
> * No admin authentication bypass.
> * No client-side privilege escalation.
> * No public customer data.
> * No public private settings.
> * No insecure Firestore rules.
> * No path traversal.
> * No unsafe file uploads.
> * No public email relay.
>
> Architecture requirements:
>
> * One authoritative authentication system.
> * One authoritative production datastore.
> * Server-side email delivery.
> * Secure object storage for media.
> * Runtime API validation.
> * Strict TypeScript.
> * Centralized error handling.
> * Distributed rate limiting where required.
>
> Development requirements:
>
> * Preserve the current UI/design.
> * Do not remove existing functionality unless it is insecure or broken.
> * Do not invent new credentials.
> * Do not disable security controls to make tests pass.
> * Do not use `any` as a shortcut.
>
> After every implementation group:
>
> 1. Run typecheck.
> 2. Run tests.
> 3. Run production build.
> 4. Test affected API endpoints.
> 5. Verify authentication/authorization.
> 6. Report changed files.
> 7. Report completed BUG-IDs.
> 8. Report remaining BUG-IDs.
> 9. Report any new risks.
>
> Do not claim a bug is fixed until it has been verified.
>
> Begin with Phase 0: credential exposure and secret rotation/removal.
>
> Then proceed to Phase 1: authentication and authorization.
>
> Continue through the phases in dependency order.

---

# 45. Final Success Criteria

The TechFix Peshawar project is production-ready when:

**Security**

* No critical vulnerabilities remain.
* No high-risk authentication bypass remains.
* No credentials are exposed.

**Data**

* Customer records are private.
* Data persistence is durable.
* Transactions are reliable.

**Backend**

* APIs are authenticated/validated appropriately.
* Rate limiting works.
* Errors are handled correctly.

**Frontend**

* Authentication state is trustworthy.
* Routing works.
* API state is consistent.

**Email**

* Notifications are reliable.
* Failures are visible.
* Duplicate emails are prevented.

**Media**

* Uploads are validated.
* Files are safely stored.
* Path traversal is impossible.

**Code**

* TypeScript strict mode passes.
* Tests pass.
* Build passes.

**Deployment**

* Environment configuration works.
* VS Code debugging works.
* Production deployment does not depend on local JSON/filesystem state.

**Documentation**

* README is accurate.
* No merge conflicts remain.
* Setup and deployment instructions are complete.

---

## Final Priority

**P0 Security → P1 Data/Backend → P1 Upload/Email → P2 Frontend → P2 TypeScript → P2 Deployment**

The 250 individual audit findings remain the traceability layer underneath this PRD. Each implementation task should reference its original `BUG-XXX` identifier so that no finding is lost during remediation.
