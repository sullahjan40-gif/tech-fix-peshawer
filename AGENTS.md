# TechFix Peshawar — Antigravity Master Engineering Instructions

## 1. Project Mission

You are the senior software engineer responsible for fixing and preparing the TechFix Peshawar application for production.

The project already contains:

* React/Vite frontend
* Express backend
* Firebase/Firestore
* Admin dashboard
* Booking system
* Customer inquiry system
* CMS
* Media uploads
* Email/notification system

A comprehensive audit identified 250 BUG findings.

The complete remediation plan is documented in:

`TechFix-Peshawar-Production-Readiness-PRD.md`

Read that PRD before making significant changes.

---

# 2. Critical Rule

DO NOT rewrite the entire project.

DO NOT blindly modify all 250 bugs at once.

Work in controlled phases.

Fix the highest-risk issues first, verify them, then continue.

---

# 3. Required Fixing Order

Follow this order:

1. Phase 0 — Credentials and secrets
2. Phase 1 — Authentication and authorization
3. Phase 2 — Customer-data protection
4. Phase 3 — Database and persistence
5. Phase 4 — API validation and abuse protection
6. Phase 5 — File and media security
7. Phase 6 — Email and notifications
8. Phase 7 — Frontend state and routing
9. Phase 8 — TypeScript and code quality
10. Phase 9 — Development and deployment

Do not skip directly to lower-priority issues while P0 security problems remain unresolved.

---

# 4. Before Editing Any Code

Before fixing a BUG-ID:

1. Locate the exact file and relevant code.
2. Read the surrounding implementation.
3. Search for every caller/usages of the affected function, variable, endpoint, collection, or component.
4. Understand dependencies.
5. Identify the actual root cause.
6. Check whether another BUG-ID depends on the same code.
7. Make the smallest safe architectural change.
8. Preserve existing functionality unless it is insecure or demonstrably broken.

Never modify code based only on a filename or line number.

---

# 5. BUG-ID Traceability

Every fix must reference its original BUG-ID.

Example:

```text
BUG-006
BUG-007
BUG-008
```

When completing a task, report:

* BUG-ID
* Root cause
* Files changed
* Fix implemented
* Tests performed
* Verification result
* Remaining risk

Never mark a BUG-ID as fixed without verification.

---

# 6. Security Rules

These rules are mandatory.

## Never:

* Add hardcoded passwords.
* Add API keys to source code.
* Add credentials to `.env.example`.
* Store passwords in localStorage.
* Store plaintext passwords in Firestore.
* Create authentication bypasses.
* Accept arbitrary tokens as valid authentication.
* Trust client-side admin state.
* Allow users to assign themselves admin roles.
* Expose customer records publicly.
* Expose private settings publicly.
* Allow anonymous deletion of CRM records.
* Allow anonymous email relaying.
* Trust upload filenames.
* Allow path traversal.
* Disable Firestore security rules to make functionality work.
* Use `any` to hide type errors.
* Suppress errors instead of fixing them.

---

# 7. Credentials

If exposed credentials are found:

1. Identify the credential type.
2. Do NOT print the secret value in your response.
3. Do NOT copy the secret into another file.
4. Recommend/perform removal from source where appropriate.
5. Mark the credential for rotation.
6. Remove it from frontend/public files.
7. Check Git tracking/history if relevant.
8. Replace it with environment/secret-manager configuration.

Never invent replacement credentials.

---

# 8. Authentication Architecture

The application must have one authoritative authentication architecture.

Preferred architecture:

```text
Firebase Authentication
        ↓
Firebase ID Token
        ↓
Express server verification
        ↓
Admin authorization / claims
        ↓
Protected API
```

Do not maintain competing authentication systems such as:

* static Express tokens
* token-length authentication
* localStorage passwords
* hardcoded admin emails
* mutable Firestore admin roles
* client-generated admin accounts

Frontend authentication state must reflect verified authentication.

The frontend must never be the authority for administrator privileges.

---

# 9. Authorization

Every protected operation must be authorized server-side.

Never trust:

```text
localStorage
sessionStorage
frontend role
frontend email
client-supplied role
client-supplied admin=true
```

A user must not be able to become an administrator by modifying browser state or Firestore documents.

---

# 10. Customer Data

Customer information is private.

Treat the following as sensitive:

* Name
* Phone
* Email
* Address
* Booking details
* Inquiry details
* Internal notes
* Lead information
* Activity information

Public endpoints must return only the minimum information required.

Never serialize complete database/customer objects into public API responses.

---

# 11. API Requirements

Every public or admin API endpoint must be reviewed for:

* Authentication
* Authorization
* Input validation
* Maximum field length
* Enum validation
* Type validation
* Request size
* Rate limiting
* Error handling
* Response shape
* Abuse potential

Prefer runtime schemas such as Zod or an existing project-approved validation solution.

Do not introduce multiple competing validation libraries without a reason.

---

# 12. Database Rules

Production data must not depend on fragile local JSON persistence.

Avoid:

* synchronous large JSON writes
* automatic destructive database resets
* silent corruption recovery
* multiple competing sources of truth
* storing large base64 images inside normal database documents

Before changing the datastore architecture:

1. Inspect all current database consumers.
2. Identify migration requirements.
3. Preserve existing data.
4. Create a migration strategy.
5. Verify reads and writes.

Never delete production data as a shortcut.

---

# 13. Data Integrity

Important operations should be atomic or idempotent.

For bookings:

```text
Booking
→ Customer
→ Lead
→ Activity
→ Notification
```

For inquiries:

```text
Inquiry
→ Customer
→ Activity
→ Notification
```

A notification failure must not cause the customer record to disappear.

Use idempotency where duplicate requests can create duplicate records.

---

# 14. File Upload Security

Never trust:

* filename
* extension
* MIME type supplied by the client
* base64 metadata

Validate:

* decoded content
* magic bytes
* MIME type
* file size
* image dimensions

Use generated random filenames.

Never construct filesystem paths directly from user input.

Prefer object storage for production media.

---

# 15. Email System

Email delivery must be server-side.

The frontend must not control:

* API keys
* SMTP passwords
* provider credentials
* arbitrary recipients
* private notification configuration

Customer-controlled HTML must always be escaped.

Never report:

```text
sent
```

until the provider confirms successful delivery.

Use durable delivery states such as:

```text
queued
sending
sent
failed
retrying
```

Prevent duplicate notifications when retrying.

---

# 16. Frontend Rules

Preserve the existing UI and design.

Do not redesign the website unless explicitly requested.

Fix:

* authentication state
* API state
* routing
* loading states
* error states
* stale caches
* duplicate data sources

Do not silently replace valid server data with fallback data.

---

# 17. Firebase Rules

Firestore security rules are security boundaries.

Never weaken rules simply because the frontend currently fails.

When changing rules:

1. Identify the collection.
2. Identify every legitimate reader.
3. Identify every legitimate writer.
4. Identify admin operations.
5. Prevent self-escalation.
6. Test anonymous access.
7. Test normal-user access.
8. Test administrator access.

---

# 18. TypeScript

Progressively enable strict TypeScript.

Target:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Do not solve TypeScript errors by adding:

```typescript
any
```

Instead:

* define interfaces
* define types
* validate runtime input
* narrow unknown values
* create shared models

---

# 19. Error Handling

Use centralized Express error handling.

Unexpected errors should:

1. Generate/use a correlation ID.
2. Log useful server-side information.
3. Return safe JSON.
4. Avoid exposing stack traces.
5. Return correct HTTP status codes.

Do not use empty catches such as:

```typescript
catch (error) {}
```

unless there is a documented reason and safe handling.

---

# 20. Logging

Logs must help diagnose production problems without exposing secrets or unnecessary customer data.

Never log:

* passwords
* API keys
* authentication tokens
* complete sensitive customer records

Redact sensitive fields.

---

# 21. Development Environment

The project uses a custom Express/Vite development architecture.

Do not replace the project server with Live Server merely to make frontend debugging easier.

VS Code should support:

### Frontend

Chrome/Edge debugger.

### Backend

Node/tsx debugger.

The debugger must use the actual application port.

Do not assume port 8080 if the application uses port 3000.

---

# 22. Build Verification

After meaningful changes run the appropriate commands, including:

```bash
npm install
npm run typecheck
npm run build
```

and tests if available.

Do not claim success if a command was not actually run.

If a command fails because of the environment, report the exact failure.

---

# 23. Testing

For security-related changes, test both:

### Allowed

and

### Forbidden

operations.

Example:

```text
Anonymous → public endpoint       PASS
Anonymous → admin endpoint        DENIED

Normal user → own data            PASS
Normal user → another user's data DENIED

Normal user → admin role change   DENIED
Admin → admin operation           PASS
```

---

# 24. AI Agent Change Discipline

Before modifying a shared function:

1. Search all usages.
2. Identify frontend callers.
3. Identify backend callers.
4. Identify tests.
5. Identify API dependencies.
6. Make compatible changes where possible.
7. Update affected callers.
8. Run verification.

Do not make isolated changes that break other parts of the application.

---

# 25. Do Not Hide Problems

Never fix a problem by:

* disabling a feature
* disabling authentication
* making Firestore public
* ignoring TypeScript errors
* adding `any`
* suppressing exceptions
* returning fake success responses
* hardcoding fallback credentials
* deleting customer data
* deleting security rules

The objective is a real fix.

---

# 26. UI Preservation

Unless the PRD explicitly requires a UI change:

* preserve layout
* preserve colors
* preserve branding
* preserve animations
* preserve content
* preserve navigation
* preserve responsive behavior

Security and correctness fixes may change behavior where necessary.

---

# 27. Phase Completion

Do not move to the next major phase until the current phase has been verified.

At the end of every phase report:

```text
PHASE:
STATUS:

Completed BUG-IDs:
- BUG-XXX
- BUG-XXX

Files changed:
- ...

Tests:
- ...

Typecheck:
PASS / FAIL

Build:
PASS / FAIL

Security verification:
PASS / FAIL

Remaining issues:
- ...

Risks:
- ...
```

---

# 28. Required Final Report

When all phases are complete, produce:

## Security

* Critical findings remaining
* High findings remaining
* Credential exposure status
* Authentication status
* Authorization status
* Firestore rules status

## Data

* Datastore architecture
* Migration status
* Backup status
* Data integrity status

## API

* Validation status
* Rate limiting status
* Idempotency status
* Error handling status

## Email

* Provider status
* Retry status
* Delivery tracking
* Duplicate prevention

## Media

* Upload validation
* Storage
* Path traversal protection

## Frontend

* Authentication
* Routing
* State management
* Error handling

## Development

* Typecheck
* Tests
* Build
* VS Code debugging

## Remaining Bugs

List every unresolved BUG-ID.

Never claim production readiness while unresolved P0 issues remain.

---

# 29. First Task

Do NOT start by changing random files.

Start with:

## Phase 0 — Credential Exposure

Review:

* `.env`
* `.env.example`
* `data/database.json`
* source files containing credential-like values
* Git tracking/history where relevant

Identify exposed credentials without printing their values.

Then remove credential exposure from the codebase and establish secure configuration.

After Phase 0 is complete and verified, proceed to:

## Phase 1 — Authentication & Authorization

Follow the PRD and BUG-ID order.

---

# 30. Primary Reference

The complete requirements are in:

`TechFix-Peshawar-Production-Readiness-PRD.md`

Use the PRD as the authoritative remediation plan.

Use this `AGENTS.md` as the engineering behavior and safety rules.

When the two documents appear to conflict, prioritize:

1. Security
2. Data integrity
3. Existing functionality
4. PRD requirements
5. Minimal safe change

Never weaken security merely to preserve broken behavior.
