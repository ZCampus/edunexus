# EduNexus — Quality Scorecard (Frontend · Backend · Database)

**Date:** 20 August 2026  
**Audience:** FE developer · BE developer · DB developer · Lead  
**Companion docs:** `API-CONTRACT-GAP-REPORT.md`, `THREE-LAYER-ALIGNMENT-REPORT.md`

---

## 1. Overall grades at a glance

| Layer | Overall | Best for | Not ready for |
|---|---|---|---|
| **Frontend (UI)** | **C+** | Demo / investor walkthrough, UX exploration | Production SaaS (auth, API, tests) |
| **Backend (API)** | **D** | Nest module scaffolding / learning structure | Any real deploy (no DB, weak validation/security) |
| **Database** | **C** | Academic multi-tenant schema design | “Apply migrations and go” (order bugs + RLS holes) |

```text
Quality (higher = better)

Frontend  ████████░░░░  C+
Database  ███████░░░░░  C
Backend   ████░░░░░░░░  D
```

**Lead takeaway:** UI looks furthest along as a *product demo*. Database has the strongest *domain design* but ships with migration/RLS defects. Backend is the weakest production link — structure without durable data or input safety.

---

## 2. Frontend — `ZCampus/edunexus`

**Overall: C+** (polished demo, not production)

### Dimension scores

| Dimension | Grade | Notes |
|---|---|---|
| Architecture & folders | **B** | Clear App Router portals by role; shared UI kit |
| TypeScript typing | **A−** | `strict: true`; rich domain types; almost no `any` |
| UI consistency | **A−** | shadcn + tokens; coherent admin/portal chrome |
| State management | **B−** | Context + sessionStorage stores; React Query underused |
| Errors / loading | **C+** | Skeletons & toasts in places; few route-level `error.tsx` |
| Accessibility | **B** | Radix basics; no a11y test suite |
| Security hygiene | **D+** | Demo password, client-only guards, token in sessionStorage |
| Testing | **F** | No unit/e2e scripts or files |
| Performance | **C** | Heavy `"use client"`; large mock modules |
| DX (README/lint/env) | **C+** | Lint OK; README still thin/demo-oriented |
| Completeness vs polish | **B−** | Many screens; stubs & dead paths remain |

### Strengths
1. Role-based portal structure (student / parent / teacher / admin / super-admin).
2. Strong TypeScript discipline.
3. Cohesive design system (shadcn + theme tokens).
4. Broad demo surface with i18n / dark mode / offline banner.
5. Permission helpers and forbidden states in admin/SaaS areas.

### Top risks / debt
1. **Zero automated tests.**
2. **API stubs inverted** — real `NEXT_PUBLIC_API_URL` often throws `API_NOT_WIRED`; login does not call Nest.
3. Almost everything is client-rendered (weak RSC strategy).
4. Demo auth (hardcoded password, no httpOnly cookies / middleware).
5. Dead/stub flows (unused shells, fake reset password, unused login helpers).

### Frontend quality verdict
Treat as **UI prototype with production-looking polish**. Do not measure “done” by screen count — measure by wired auth + one vertical slice against a real API.

---

## 3. Backend — `ZCampus/school-management-system` (`main`)

**Overall: D** (early Nest prototype)

### Dimension scores

| Dimension | Grade | Notes |
|---|---|---|
| Module architecture | **B−** | Controllers → services → repo interfaces; feature modules |
| DTO validation | **F** | No `class-validator` / global `ValidationPipe` |
| Auth & security | **D+** | JWT + roles + throttle + bcrypt sketched; serious leaks/holes |
| Error handling | **C** | Nest HTTP exceptions; success envelope ≠ error shape |
| Persistence | **F** | All in-memory; Prisma schema empty; no migrations used |
| Testing | **F** | Only Nest scaffold hello-world tests |
| API design | **C−** | Some `{ success, data }` patterns; no global prefix/CORS/OpenAPI |
| Duplication / repos | **C** | Good DI tokens; copy-paste CRUD across modules |
| Logging | **C** | Winston + interceptor; no request IDs/tracing |
| Docs / prod readiness | **F** | Stock Nest README; no `.env.example` / runbook |
| TypeScript quality | **C−** | Partial strictness; `any` on requests |

### Strengths
1. Clear Nest feature-module layout.
2. Repository interfaces ready to swap to Prisma/SQL.
3. Auth *skeleton* (JWT, roles, bcrypt, throttle).
4. Tenant-aware queries in memory repos (intent is right).
5. Basic health + request logging.

### Top risks / debt
1. **No durable database** — restart = data loss; Prisma unused.
2. **No input validation** — any JSON body accepted.
3. **Security defects** — default JWT secret; responses can leak `passwordHash`; reset `debugToken` returned; client-supplied `tenantId`/`userId` (IDOR / cross-tenant risk).
4. Open registration can assign privileged roles.
5. Near-zero tests and ops documentation.

### Backend quality verdict
Good **classroom structure**, poor **ship quality**. Priority is not more modules — it is validation, real persistence against the `database` branch schema, and auth hardening.

---

## 4. Database — `school-management-system` branch `database`

**Overall: C** (strong design intent, blocked by defects)

### Dimension scores

| Dimension | Grade | Notes |
|---|---|---|
| Schema / normalization | **B−** | Coherent academic domains; composite `(school_id, id)` FKs |
| Multi-tenancy | **C** | `school_id` widespread; helper `current_school_id()` unsafe |
| Enums & constraints | **B−** | Solid enums; some free-text statuses; weak date checks |
| Indexes | **B** | Dedicated index migration; some redundancy |
| RLS / security | **C−** | RLS enabled; policy gaps vs README claims |
| Audit / soft delete | **D+** | Columns exist; triggers incomplete / broken attachment |
| Migration hygiene | **D** | **Order bugs** can stop `supabase db reset` |
| Seed data | **B−** | Reference-only seed (good); thin permission catalogue |
| Validation / tests | **D** | Minimal existence checks; no real RLS e2e |
| Completeness vs SaaS | **C** | Strong academics; no fees/homework/library tables |
| Docs vs SQL consistency | **C−** | README promises stricter access than policies deliver |

### Strengths
1. Multi-tenant design with composite FKs (prevents cross-school joins).
2. Academic model depth: years → terms → classes/streams → assignments → enrollments → marks → report cards.
3. Enums for attendance/exams/announcements.
4. Seed stays reference data (no fake schools).
5. Some assignment-aware RLS helpers for marks/attendance.

### Critical defects (fix before trusting the branch)
1. **FK / unique ordering** — some FKs reference composite uniques created in a *later* migration → apply-order failure risk.
2. **Audit trigger** attaches `updated_at` to a table that may lack the column → migration failure risk.
3. **`current_school_id()`** uses `LIMIT 1` without deterministic context → wrong tenant for multi-school users.
4. RLS gaps (e.g. teachers blocked from reading students; schools readable mainly by super-admin patterns) vs product README.
5. Soft-delete often ignored by RLS/uniques.

### Database quality verdict
Treat as **promising schema draft**, not a green “production migrations” seal. Fix apply-order + RLS context before Backend wires Prisma to it.

---

## 5. Cross-layer quality comparison

| Concern | Winner today | Why |
|---|---|---|
| User-facing polish | **Frontend** | Screens, i18n, design system |
| Domain modeling depth | **Database** | Enrollment, streams, report cards, RLS intent |
| API production readiness | **None (Backend weakest)** | No DB + weak validation/security |
| Test maturity | **None** | All layers near F on automated tests |
| Security maturity | **None yet** | FE demo auth; BE leaks/IDOR; DB RLS incomplete |

---

## 6. What “good enough for MVP integrate” looks like

### Frontend → raise to **B**
- [ ] Real login against API; remove demo-password path in staging
- [ ] Wire one vertical slice (e.g. students list) without `API_NOT_WIRED`
- [ ] Add Playwright smoke (login + one portal)
- [ ] Route `loading.tsx` / `error.tsx` for portals

### Backend → raise to **C+ / B−**
- [ ] Global `ValidationPipe` + `class-validator` on all DTOs
- [ ] Prisma models mapped from **fixed** DB migrations
- [ ] JWT secret from env only; never return `passwordHash`
- [ ] Bind `schoolId` from token (not client body/path alone)
- [ ] `/api/v1` prefix + CORS + `.env.example`
- [ ] Service-level tests for auth + students

### Database → raise to **B**
- [ ] Repair migration order (uniques before FKs)
- [ ] Fix audit triggers
- [ ] Deterministic school context for RLS
- [ ] Close teacher/student/school SELECT policies to match README
- [ ] Add fee tables *if* fees stay in MVP (else explicitly out of scope)

---

## 7. Suggested conversation with the three developers

1. **UI:** “UI quality is strong for a demo (C+). Next metric is *wired slices*, not more pages.”
2. **Backend:** “Architecture grade is OK; ship grade is D because data and validation are missing. Pause new modules; persist + validate + harden auth.”
3. **Database:** “Schema thinking is the best of the three (academic depth). Quality is C until migrations apply cleanly and RLS matches the README.”

---

## 8. One-slide summary for WhatsApp / standup

| | FE | BE | DB |
|---|---|---|---|
| Grade | **C+** | **D** | **C** |
| Superpower | Polish & portals | Nest module shape | Multi-tenant academics |
| Blocker | Mock auth/API, no tests | No DB, no validation, auth holes | Migration order + RLS gaps |
| Next move | Wire 1 slice | Prisma + ValidationPipe | Fix migrations/RLS |

---

**Snapshot sources:** local `edunexus` frontend tree; `school-management-system` `main` (Nest); `database` branch (`supabase/migrations`).  
**Signed:** 20 Aug 2026
