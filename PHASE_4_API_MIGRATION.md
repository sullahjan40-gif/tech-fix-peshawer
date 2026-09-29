# Tech Fix Peshawar — Phase 4

## Express to Next.js API Migration

## Objective

Convert the existing Express backend into Next.js Route Handlers.

Use ONLY the confirmed API inventory from:

```text
PHASE_1_MIGRATION_ANALYSIS.md
```

Do not invent or simplify endpoints.

---

## 1. Read Previous Reports

Read:

```text
PHASE_1_MIGRATION_ANALYSIS.md
PHASE_2_COMPLETION.md
PHASE_3_COMPLETION.md
```

Use the approved API migration map.

---

## 2. Create Route Handlers

For every confirmed Express endpoint, create the corresponding:

```text
app/api/.../route.ts
```

Use:

```ts
export async function GET()
export async function POST()
export async function PUT()
export async function PATCH()
export async function DELETE()
```

only where the original API uses that method.

---

## 3. Preserve API Contracts

For every endpoint preserve:

* HTTP method
* URL
* request body
* query parameters
* path parameters
* authentication
* authorization
* validation
* Firestore behavior
* Storage behavior
* email behavior
* response structure
* HTTP status codes
* error behavior

Do not silently change API contracts.

---

## 4. Authentication Middleware Conversion

Identify Express middleware such as:

```text
authentication
authorization
admin checks
token verification
```

Convert it into reusable Next.js server-side utilities.

Do not bypass authentication.

---

## 5. Admin Verify Token

Migrate the confirmed endpoint:

```text
/api/admin/verify-token
```

according to the actual implementation discovered in Phase 1.

The endpoint must verify the Firebase ID token server-side.

Do not return success without verification.

---

## 6. Firestore

Move existing server-side Firestore operations into the appropriate server-side Next.js modules.

Do not expose Firebase Admin credentials.

Do not change collection names.

Do not delete production data.

---

## 7. File Uploads

For every existing upload endpoint:

1. Inspect the existing implementation.
2. Preserve its behavior.
3. Use `request.formData()` where appropriate.
4. Preserve file validation.
5. Preserve authentication.
6. Preserve Storage paths.

Do not assume all uploads work like JSON requests.

---

## 8. Email APIs

Move existing email sending to server-side Next.js code.

Keep API keys server-only.

Preserve the existing email provider and behavior unless Phase 1 explicitly approved a change.

---

## 9. Error Handling

Preserve appropriate HTTP status codes.

At minimum distinguish:

```text
400
401
403
404
500
```

according to the existing application's behavior.

Do not expose secrets or internal stack traces to clients.

---

## 10. Remove Express Runtime Dependency

Only after all confirmed APIs have been migrated and tested:

* remove the standalone Express server runtime
* remove `app.listen()`
* remove unnecessary Express deployment configuration

Do not delete Express-related code before its functionality has been migrated.

---

## 11. API Testing

Test every migrated endpoint.

For each endpoint verify:

```text
request
authentication
authorization
database operation
response
error response
```

Do not rely only on the browser UI.

---

## 12. Completion Report

Create:

```text
PHASE_4_COMPLETION.md
```

Include:

1. Every migrated endpoint
2. Original Express file
3. New Next.js route
4. Authentication behavior
5. Authorization behavior
6. Firestore operations
7. Storage operations
8. Email operations
9. API test results
10. Remaining issues

---

## STOP

Do not begin the final Firebase/auth integration phase until Phase 4 is complete and verified.

Wait for approval.
