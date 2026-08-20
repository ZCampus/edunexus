# EduNexus — Three-Layer Alignment Report  
## Frontend (UI) × Backend (API) × Database (Supabase)

**Date:** 20 August 2026  
**Audience:** Frontend developer · Backend developer · Database developer · Lead  
**Org:** [ZCampus](https://github.com/ZCampus)  
**Overall verdict:** **The three layers are not aligned.** Each was built with a different mental model. Do not start deep integration until a shared contract is frozen.

---

## 1. Where each layer lives

| Layer | Location | Stack / shape | Maturity |
|---|---|---|---|
| **Frontend / UI** | [`ZCampus/edunexus`](https://github.com/ZCampus/edunexus) · `main` | Next.js App Router, mock stores, almost no live HTTP | Rich portals (student, parent, teacher, admin, SaaS) |
| **Backend / API** | [`ZCampus/school-management-system`](https://github.com/ZCampus/school-management-system) · `main` | NestJS, **in-memory** entities/DTOs, Prisma schema empty | CRUD modules for school ops + auth + library + fees |
| **Database** | Same SMS repo · branch **`database`** | Supabase/PostgreSQL migrations + RLS | Strong multi-tenant academic schema; **not wired** to Nest yet |

> There is **no third standalone “database repo”** in the org today. Database work is the `database` branch under `school-management-system` (`supabase/migrations/001` … `017`).

---

## 2. Executive summary (one page)

| Theme | Frontend | Backend | Database | Aligned? |
|---|---|---|---|---|
| Multi-tenancy key | `schoolId` / tenant mock ids (`t1`) | `tenantId` on every entity | `school_id` (UUID) + composite FKs | **No** (naming + model) |
| Auth | Demo login, local roles | JWT + password hash in memory; `POST /auth/*` | Supabase `auth.users` + `public.users` + RBAC tables | **No** |
| Roles | 10 UI roles (incl. sales/support/finance) | ~9 string roles on `User` | Seed: `SUPER_ADMIN`, `HEADMASTER`, `TEACHER`, `STUDENT`, `PARENT` | **No** |
| Students | Rich admin record + admission/class/parents | Minimal (`firstName`, `lastName`, …) | Rich (`admission_number`, names, `user_id`, gender, …) + **enrollment** tables | **Partial** (DB richest) |
| Classes | `name` + `section` | `name` + optional `stream` + `academicYear` | `classes` + separate **`streams`** + years/terms | **No** |
| Attendance | **Period-level** UI | **Day-level** one row | **Day/session** (`attendance_sessions` + records) | **FE diverges** |
| Marks / exams | Simple score rows + report card mock | Exam + Mark entities (flat) | Exams → components → marks → moderation → approvals → **report_cards** | **DB ahead of BE/FE** |
| Fees | Parent fee UI + M-Pesa demo | Fee + Payment modules | **No fee tables** | **DB gap** |
| Homework | Full student/teacher/parent flows | **Missing** | **Missing** | **Both BE+DB gap** |
| SaaS billing / tickets | Full super-admin UI | **Missing** | **Missing** (only `schools` + settings) | **BE+DB gap** |
| Library | Almost none | Full library module | **Missing** | **DB gap** |
| Persistence | `sessionStorage` | In-memory maps | Real SQL + RLS | **Not connected** |
| API ↔ DB | N/A | Does not use migrations / Prisma empty | Designed for Supabase Auth + RLS helpers | **Not integrated** |

**Bottom line:**  
- **Database** is the most complete *academic* model.  
- **Frontend** is the most complete *product surface*.  
- **Backend** is a simplified API sketch that matches **neither** FE richness nor DB structure.

---

## 3. Architecture picture (current reality)

```text
┌─────────────────────────┐
│  FRONTEND (edunexus)    │
│  Mock / sessionStorage  │──── almost no HTTP ────┐
│  Rich portals           │                        │
└─────────────────────────┘                        ▼
                                        ┌──────────────────────┐
                                        │ BACKEND (SMS main)   │
                                        │ Nest in-memory CRUD  │
                                        │ Prisma schema EMPTY  │
                                        └──────────┬───────────┘
                                                   │  NOT WIRED
                                                   ▼
                                        ┌──────────────────────┐
                                        │ DATABASE (SMS        │
                                        │  branch: database)   │
                                        │ Supabase migrations  │
                                        │ RLS + school_id      │
                                        └──────────────────────┘
```

Target (after contract freeze) should be:

```text
UI  ──HTTP /api/v1──►  Nest API  ──Prisma/Supabase client──►  PostgreSQL (migrations)
                         ▲
                    JWT / roles mapped to DB RBAC
```

---

## 4. Domain-by-domain three-way matrix

Legend: ✅ roughly same idea · ⚠️ similar but different shape · ❌ missing / incompatible

### 4.1 Identity & tenancy

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Tenant | Mock tenants / `schoolId` on user | `tenantId` string on entities | `schools` + `school_settings` | ⚠️ |
| Login user | `AuthUser` (demo) | `User` + bcrypt + JWT | `auth.users` ←→ `public.users` | ❌ |
| Roles | Fixed TS union (10) | Fixed string union on user | `roles` + `user_roles` + `permissions` | ❌ |
| Permissions | Admin/SaaS module matrices in UI | Role guards (hardcoded strings) | `permissions` + `role_permissions` + RLS helpers | ⚠️ idea only |

**DB seeded roles:** `SUPER_ADMIN`, `HEADMASTER`, `TEACHER`, `STUDENT`, `PARENT`  
**FE extras with no DB seed:** `school_admin`, `principal`, `accountant`, `sales`, `support`, `finance`  
**BE extras:** `school_owner`, `accountant`, `librarian`, `admin`, plus guard roles like `class_teacher`

### 4.2 People

| Entity | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Student | `admissionNo`, `classId`, `parentIds`, gender, status `active\|inactive\|archived` | Minimal; status `active\|inactive\|graduated\|transferred`; **no admission/class** | `admission_number`, names, optional `user_id`, status text; class via **enrollments** | ⚠️ |
| Parent | first/last, relation, occupation, status | first/last, **required userId**, relationship on link table | `full_name` (not split), optional `user_id`, `student_parents.relationship_type` | ⚠️ |
| Teacher / staff | Staff with roles + subject/class ids | Teacher profile only (qualification, hireDate) | `teachers` + `employee_number` + `teacher_assignments` | ⚠️ |
| Parent↔student | `parentIds[]` on student | `ParentStudent` link | `student_parents` | ✅ idea |

### 4.3 Academic structure

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Academic year / term | Strings on settings (`academicYear`, `term`) | Strings on exam/fee | Tables `academic_years`, `terms` | ❌ FE/BE too flat |
| Class | `name` + `section` | `name` + optional `stream` | `classes` **and** `streams` | ❌ |
| Subjects | Per-school list with teacherIds | Often free-text on exam | Global `subjects` + `school_subjects` + `class_subjects` | ⚠️ |
| Teacher assignment | Arrays on staff/class | Not modeled | `teacher_assignments` (year + class/stream + subject) | ❌ FE/BE |

### 4.4 Enrollment

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Enrollment | Implied by `student.classId` | None | `enrollments` + `enrollment_placements` + rich status enums | ❌ FE/BE |

### 4.5 Attendance

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Grain | **Period / lesson** | **One row per student per day** | **Session per day** + records | ❌ FE |
| Status values | present/absent/late/excused/(leave) | present/absent/late/excused | `PRESENT\|ABSENT\|LATE\|EXCUSED` | ⚠️ (FE `leave`) |

### 4.6 Assessment & report cards

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Exam | Simple exam list / marks entry | Exam entity (quiz/test/exam) | `exams` + `exam_type` enum + components | ⚠️ |
| Marks | Flat score | Flat mark on exam | Marks on **exam_component** + subject + enrollment | ❌ |
| Moderation / approval | Headmaster “approvals” mock | None | `mark_moderations`, `mark_approvals` | ❌ FE/BE |
| Report card | Mock report card UI + stub GET | **No module** | `report_cards` + `report_card_items` | ⚠️ DB only |

### 4.7 Fees & payments (school fees)

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Fee balance / history | Parent portal | `Fee` + `Payment` entities + controllers | **No tables** | ❌ DB |
| Methods | M-Pesa demo | mpesa/airtel/tigo/halo/bank/cash/card | — | BE only |

### 4.8 Homework / learning materials

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Homework | Full flows (3 portals) | Missing | Missing | ❌ |
| Materials | Student/teacher mocks | Missing | Missing | ❌ |

### 4.9 Communication

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Announcements | Feeds / notices | `Announcement` under parents module | `announcements` + categories + audiences | ⚠️ |
| Notifications | Prefs SMS/WhatsApp/Email | Missing as first-class | `notifications` + prefs (`IN_APP\|EMAIL\|SMS\|PUSH`) — **no WhatsApp** | ⚠️ |
| Parent↔teacher messages | Message threads in UI | Missing | Missing | ❌ |

### 4.10 Platform SaaS (multi-school commercial)

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Plans / invoices / tickets / platform staff | Full super-admin | Missing | Only `schools` (+ settings); no plans/billing/tickets | ❌ |
| School status | trial/active/suspended/cancelled | N/A | `ACTIVE\|SUSPENDED\|ARCHIVED` | ⚠️ |

### 4.11 Library

| Concept | Frontend | Backend | Database | Status |
|---|---|---|---|---|
| Books / borrow | Minimal / none | Full module | Missing | ❌ DB |

---

## 5. Naming & enum conflicts (must freeze)

| Topic | FE | BE | DB | Proposed freeze (suggestion) |
|---|---|---|---|---|
| Tenant field | `schoolId` | `tenantId` | `school_id` | Use **`schoolId` / `school_id`** everywhere; drop `tenantId` |
| Student number | `admissionNo` | *(missing)* | `admission_number` | `admissionNumber` |
| Class subdivision | `section` | `stream` (optional string) | table `streams` | Keep DB model: **class + stream** |
| Attendance grain | period | day | day/session | **Day/session for v1**; period as v2 |
| Attendance excused | excused / leave | excused | EXCUSED | Map `leave` → EXCUSED or add LEAVE later |
| Auth provider | custom demo | custom JWT | **Supabase Auth** | Decide: Nest-owned auth **or** Supabase Auth (DB assumes Supabase) |
| IDs | string slugs (`s-neema`) | string ids | UUID v7 | UUID everywhere in API |

---

## 6. What each developer “owns” today (and the risk)

| Person / layer | Built | Risk if they continue alone |
|---|---|---|
| **UI dev** | Portals & UX against mocks | More screens that cannot map to DB/API |
| **Backend dev** | Nest CRUD + in-memory | API that neither FE nor SQL can consume without rewrite |
| **DB dev** | Supabase schema + RLS | Perfect schema with no Nest models / no FE types |

---

## 7. Recommended source-of-truth order

Until proven otherwise, treat layers in this order when resolving conflicts:

1. **Database** — academic multi-tenant truth (school_id, enrollment, streams, RLS)  
2. **Product/UI flows** — which screens are MVP  
3. **Backend** — must **adapt** to DB schema (Prisma/SQL) and expose stable DTOs for UI  

Do **not** invent a fourth model “in the API” that matches neither.

---

## 8. Phased plan (three teams)

### Phase 0 — Contract freeze (all three, 1–2 days)

Deliverables:

- [ ] One OpenAPI (or shared `packages/contract`)  
- [ ] Glossary: school, class, stream, enrollment, session attendance  
- [ ] Role map FE ↔ BE ↔ DB codes  
- [ ] Decision: **Supabase Auth vs Nest JWT**  
- [ ] Decision: fees & homework in MVP scope? (DB currently lacks both)

### Phase 1 — Wire Backend ↔ Database

- [ ] Point Nest at Postgres (Prisma models generated from migrations **or** Supabase client)  
- [ ] Replace in-memory repos for: schools, users/roles, students, parents, teachers, classes/streams, enrollments  
- [ ] Global prefix `/api/v1` + CORS  
- [ ] Stop using `tenantId`; use `schoolId`

### Phase 2 — Wire Frontend ↔ Backend (vertical slices)

Order:

1. Auth + me/profile  
2. Students + classes/streams + enrollments  
3. Parents link  
4. Attendance (day/session)  
5. Exams/marks (read first, then write)  
6. Report cards (read from DB tables)  
7. Fees (**requires new DB migrations** if still in MVP)  
8. Homework (**requires new DB + BE** if still in MVP)

### Phase 3 — Platform SaaS & extras

- Plans, billing, tickets (new DB + BE)  
- Library (BE exists → add DB)  
- Period attendance v2 if still required  

---

## 9. Decisions for the lead (answer before coding)

1. **Auth:** Supabase Auth (as DB README assumes) or Nest JWT?  
2. **Tenant naming:** standardize on `school_id`?  
3. **Attendance MVP:** day/session only?  
4. **Fees in MVP?** If yes, DB must add fee/payment migrations.  
5. **Homework in MVP?** If yes, DB + BE greenfield.  
6. **SaaS billing in MVP?** If yes, new platform tables beyond `schools`.  
7. **Single repo vs three:** keep DB on `database` branch, or split to `ZCampus/database`?

---

## 10. Appendix — DB migration map (branch `database`)

| File | Domain |
|---|---|
| `001_extensions_uuid.sql` | UUID helpers |
| `002_enums.sql` | Status / exam / attendance / announcement enums |
| `003_platform.sql` | `schools`, `school_settings` |
| `004_identity_rbac.sql` | `users`, `roles`, `permissions`, `user_roles`, `role_permissions` |
| `005_people.sql` | `students`, `teachers`, `parents`, `student_parents` |
| `006_academic_structure.sql` | subjects, years, terms, classes, streams, assignments |
| `007_enrollment.sql` | enrollments, placements |
| `008_attendance.sql` | sessions + records |
| `009_assessment.sql` | exams, marks, moderation, report cards |
| `010_communication.sql` | announcements + notifications |
| `011`–`015` | safety, indexes, audit, RLS |
| `016_seed_reference_data.sql` | roles, permissions, subject catalogue |
| `017_validation.sql` | schema checks |

**Present in DB, weak/absent in BE:** report cards, moderation, streams, enrollments, RLS model, Supabase auth link  

**Present in BE, absent in DB:** fees/payments, library  

**Present in FE, absent in both BE+DB:** homework, SaaS billing/tickets, WhatsApp channel, period attendance  

---

## 11. Related document

See also the earlier API-only gap report:  
`docs/API-CONTRACT-GAP-REPORT.md` (Frontend ↔ Backend HTTP mismatches).

This document **extends** that view with the Database layer.

---

**Signed-off snapshot:** 20 Aug 2026  
**Sources:** `ZCampus/edunexus` (`main`), `ZCampus/school-management-system` (`main` + `database`)
