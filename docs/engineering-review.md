# Warrior AI server — engineering review vs PRD v0.1 / Data Contract v0.1

Status of the current scaffold. This is an honest inventory, not a claim of production readiness. Architecture and module boundaries are retained; security, validation and clinical logic are explicitly incomplete.

## 1. Endpoint inventory

Base path: `API_ROUTE` (default `/api/v1`).

| Endpoint | Purpose | Status | Notes |
|---|---|---|---|
| `GET /api/health` | Liveness + DB state | Implemented | No auth, no deep dependency checks |
| `POST /auth/google` | Verify Google ID token, issue app JWT | Implemented | Public exchange; strict `idToken` DTO, JWKS verification, audience check |
| `POST /auth/register` | Create email/password account | Implemented | Strict DTO; scrypt hash; duplicate-email conflict check; issues app JWT |
| `POST /auth/login` | Verify credentials, issue app JWT | Implemented | Strict DTO; constant-time verification; generic failure message |
| `GET /auth/me` | Resolve authenticated user | Implemented | Bearer auth; context-driven identity |
| `POST /onboarding/complete` | Create profile, consents, care circle | Implemented | Bearer auth; strict DTO; owner taken from context, never from body |
| `POST /identity/users` | Register user (F1) | Writes record | **No OTP verification**, no auth |
| `GET /identity/users/phone/:phoneE164` | Lookup by phone | Implemented | Exposes a Class A identifier; must be locked down |
| `POST /identity/patients` | Create patient profile (F1) | Writes record | Minor guardian consent not enforced end-to-end |
| `GET /identity/patients/:patientId` | Read profile | Implemented | **No ownership check** |
| `POST /consent/consents` | Grant/withdraw consent | Writes append-only record | No consent-text version registry, no signature |
| `GET /consent/consents/:scope` | Current consent state | Implemented | Reads latest row; no caller authorization |
| `POST /consent/contacts` | Add care-circle contact | Writes record | No verification-by-reply flow |
| `GET /consent/contacts` | List contacts | Implemented | No caller authorization |
| `POST /checkins` | Submit check-in (F2) | Writes record | Local-day collision handling is **racy**; no revision-level API |
| `GET /checkins` | Check-in history | Implemented | No ownership check; no tenant scoping |
| `POST /risk/assessments` | Daily traffic light (F3) | **501 placeholder** | No approved RuleSet activation workflow |
| `GET /risk/assessments/:checkinId` | Assessment history | Implemented | No authorization |
| `GET /risk/rules/active` | Active rules | **501 placeholder** | `RuleSet.definition` is untyped `Mixed` |
| `POST /medication/schedules` | Reminder schedule (F5) | Writes record | No dose calculation (correct), no auth |
| `POST /medication/doses` | Dose log (F5) | Writes record | Unique index may reject legitimate re-logs |
| `GET /medication/schedules` | Schedules by patient | Implemented | No ownership check |
| `POST /crises` | Crisis log (F8) | Writes record | 72h preceding-status derivation not computed |
| `GET /crises` | Crisis history | Implemented | No ownership check |
| `POST /clinic/shares` | Create share link (F7) | Writes record | **No clinic_sharing consent check**, no signing |
| `POST /clinic/shares/:id/revoke` | Revoke share | Implemented | No authorization |
| `POST /clinic/annotations` | Clinician rating (F13) | Writes record | Any caller can annotate; no clinician auth |
| `GET /clinic/dashboard/risk` | Risk-sorted dashboard (F13) | **501 placeholder** | No consent-scoped patient query |
| `GET /community/groups` | Groups (F11) | Implemented | Public list, pseudonym-safe DTOs |
| `POST /community/groups/:id/join` | Join group | Writes both rows | **Not transactional** (member + pseudonym map) |
| `POST /community/posts` | Create post | Writes record | Moderation status defaults visible; no auth |
| `GET /community/posts` | Read posts | Implemented | Pseudonym-only DTO (correct) |
| `POST /community/reports` | Report post | Writes record | No moderation action endpoints |
| `POST /events` | Offline sync ingest (§7) | Idempotent upsert | No dispatch to domain handlers, no LWW conflict logic |
| `POST /alerts` | Care-circle alert (F6) | **501 placeholder** | No provider, retry, receipt or SLA enforcement |
| `GET /alerts/failures` | Failed deliveries | Implemented | No auth; never populated yet |
| `POST /audit` | Append audit row | Writes record | Caller-controlled; not wired into protected flows |
| `GET /audit` | Read audit rows | Implemented | **Unauthorized access possible** |

### Addendum — Google OAuth + onboarding (current work)

The three endpoints above close the first security-foundation slice:

- **Authentication:** Auth.js on the web server verifies the Google account and sends the short-lived Google ID token to `POST /auth/google`. The API verifies signature, issuer and audience with Google JWKS, then issues a first-party HS256 bearer token.
- **Identity propagation:** `authenticate` verifies the bearer token and populates `RequestContextDTO.userId`, `roles` and `isAuthenticated`; route handlers only bind a validated DTO and call the context-first service.
- **Ownership:** `POST /onboarding/complete` has no `ownerUserId`/`patientId` input. `context.userId` is the only owner used when creating the patient profile, consents and care-circle rows.
- **Consent:** the strict DTO requires all five known scopes to be well-formed and requires `care_circle` and `sms_alerts` to be explicitly granted; minor profiles require a guardian consent reference. Consent rows are deterministic for retry safety and remain append-only.
- **Audit:** profile creation emits an audit row with a hashed IP and the actor from the authenticated context.
- **Validation:** all three new endpoints use strict Zod schemas and the central `{ error, errors, data, message, status }` envelope.

Still outstanding: the legacy endpoints in the table above remain unauthenticated/authorization-unsafe until migrated; OTP/MFA, verified-contact gating, consent-text version registry, signed clinic shares, alert delivery, and audit hash-chain/retention are not implemented.

### Addendum — email/password credentials (current work)

- `POST /auth/register` and `POST /auth/login` use strict Zod DTOs and issue the same first-party HS256 token as Google sign-in.
- Passwords are salted with 16 random bytes and derived with Node `scrypt`; verification is constant-time. `password_hash` is excluded from normal queries and never serialized.
- Credentials accounts are keyed by `(oauth_provider, email)` with a partial unique index; login failures are intentionally generic so an email address cannot be enumerated.
- Email verification, password reset, rate limiting, and MFA are still outstanding. This is password authentication for the MVP, not a replacement for OTP/MFA in the PRD.

### PRD features with no endpoint at all
OTP request/verify; clinician MFA; care finder directory read (F10); 30-day clinic summary generation and signed link retrieval (F7); "contact my clinic" (F12); red-flag triage path (F4); micro-lessons and translations (F9); moderation actions (remove post / suspend member); research aggregate extracts; account deletion and retention jobs; season alerts (F14).

## 2. Answers to the seven review questions (original scaffold; see addendum above for the OAuth slice)

1. **Authentication / identity propagation** — Not implemented. `RequestContextDTO.isAuthenticated` is always `false`; `userId` and `roles` are never populated. There is no OTP, JWT, session or MFA path.
2. **Patient ownership / consent authorisation** — Not enforced. Routes accept `patientId` from path/query/body and pass it straight to services. `ConsentService.hasConsent()` exists but is never called by share, alert or clinic flows.
3. **Runtime request validation** — Not implemented at the HTTP boundary. Handlers cast `req.body as XxxRequestDTO`. Only Mongoose schema validation fires on writes; invalid enum/range values fail late and map to a generic 500.
4. **Duplicate check-ins / events** — Events: `EventRepository.ingest()` uses an upsert on `event_id`, so duplicates are ignored; conflict resolution by `entered_at_device` and revision retention are not implemented. Check-ins: `CheckInService.submit()` reads then writes; the index is deliberately non-unique, so concurrent retries can create two "active" rows for one day.
5. **Rule versioning / approval / testing** — `RuleSet` stores a semantic version, clinician ID, approval timestamp and `definition`, but only as untyped `Mixed`. There is no approval workflow, no activation guard, no rule tests, and `RiskService.assess()` and `RulesEngineService.evaluate()` both throw `501`.
6. **SMS failure and SLA** — `AlertDelivery` records `status`, `attempts` and timestamps, but `AlertService.send()` throws `501`. No gateway, retry worker, delivery receipt, consent/verified-contact gate or one-minute SLA monitoring exists.
7. **Audit immutability / access** — Mongoose pre-hooks reject updates/deletes, and `AuditService.log()` requires a reason for admin actors. But audit rows are not emitted automatically by protected flows, the read endpoint has no access control, and there is no tamper-evidence (hash chain) or retention policy.

## 3. Gap register by priority

### P0 — Security foundation
- No authentication; no OTP verification; no clinician/admin MFA.
- No authorisation layer: patient ownership, care-circle scope, clinic scope, moderator scope and admin second-approval are unimplemented.
- Consent gates missing on clinic share, care-circle alert and research paths.
- No role guard middleware; `RequestContextDTO.roles` unused.
- Class A and Class B data stored in the same collections; separation by internal IDs is not enforced.
- Audit not wired into access/share/consent changes; no hash chain; audit read unrestricted.

### P1 — Data integrity
- No runtime DTO validation (no Zod/Joi equivalent) or request size/field whitelist beyond body limit and `<`/`>` escaping.
- Check-in one-per-local-day is racy; needs an atomic upsert/unique active-day constraint or transaction.
- `CommunityService.joinGroup()` writes two collections without a transaction.
- `RiskAssessment` does not verify that its `checkin_id` exists or that its `rule_set_version` is approved.
- Re-logging a dose at the same scheduled time is blocked by a unique index.
- `temperature_c` remains stored despite being an open clinical question.
- Event ordering, last-writer-wins and revision retention not implemented.

### P2 — Clinical functionality
- Rule engine is a stub; no thresholds, no reason ranking, no action codes, no recheck time.
- Red-flag triage path absent; `red_flags` are only stored.
- No 30-day summary, no signed share payload, no risk-sorted consented dashboard.
- Clinician annotation not restricted to clinicians.

### P3 — Communication
- No SMS/WhatsApp provider, retry with backoff, delivery receipts, failed-delivery flag propagation, or SLA timer.

### P4 — Testing / deployment
- No unit, integration or API tests.
- No OpenAPI/asyncAPI contract for a language-independent frontend (important if the backend moves to Go).
- No structured logging, metrics, tracing, alerting or PM2/container deployment config.
- Env validation covers presence of `MONGODB_URI` only; no `NODE_ENV` enum or secret-management story.

## 4. What is sound and should be retained

- Modular monolith with explicit domain boundaries and no cross-domain repository injection.
- `dtos → models → repository → services → routes` layering with a single factory wiring point.
- Central error envelope and `sendResponse()`; handlers do not build failure bodies.
- Append-only consent/audit hooks; pseudonym mapping isolated from moderator services.
- Idempotent event ingest at the database layer.
- Environment-driven Mongo URI selection, pooling/timeouts, ping-at-startup and graceful shutdown.

## 5. Recommended sequence (unchanged)

1. Security foundation — auth, authorisation, ownership, consent gates, audit controls.
2. Data integrity — runtime validation, constraints, idempotency, transactions.
3. Clinical functionality — check-in processing, approved rule engine, red-flag escalation.
4. Communication — gateway, retry, receipts, SLA.
5. Testing and deployment — tests, API contract, observability, hardening.
