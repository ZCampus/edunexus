# EduNexus × ZCampus — API Contract Gap Report

**Tarehe:** 20 Agosti 2026  
**Lengo:** Kuonyesha hali halisi kabla ya kuanza kuunganisha (wire) frontend na backend  
**Hadhiraji:** Frontend developer · Backend developer · Product / lead  
**Hali ya jumla:** **HAJAFANANA** — hakuna plug-and-play bado

---

## 1. Muhtasari wa utendaji (Executive summary)

Tuna **repos mbili tofauti** zilizotengenezwa kwa njia tofauti:

| | Frontend | Backend |
|---|---|---|
| **Repo** | [ZCampus/edunexus](https://github.com/ZCampus/edunexus) | [ZCampus/school-management-system](https://github.com/ZCampus/school-management-system) |
| **Stack** | Next.js (App Router) + TypeScript + mock stores | NestJS + in-memory repositories + Prisma (schema bado tupu) |
| **Hali** | UI / portals zimejaa (student, parent, teacher, admin, SaaS) | CRUD modules za msingi zipo; SaaS/platform haipo |
| **API usage** | Mock-first; HTTP paths **3 tu** zimeandikwa | Endpoints nyingi (`/auth`, `/students`, `/teachers`, …) |

**Hitimisho:** Timu haiwezi kuunganisha “tu weka URL” leo. Inahitajika **contract moja iliyokubaliwa**, kisha wiring hatua kwa hatua.

---

## 2. Repos na ownership

| Repo | URL | Mmiliki / jukumu lililopendekezwa |
|---|---|---|
| Frontend MVP | `https://github.com/ZCampus/edunexus` | Frontend — UI, client types, React Query |
| Backend SMS | `https://github.com/ZCampus/school-management-system` | Backend — Nest modules, DTOs, auth, DB |
| (Kumbuka) | `https://github.com/ZCampus/school-management-system` ina branches `main` + `database` (commits za DB ziko `database`) | Backend / DB |

**Kanuni ya kazi:** Mabadiliko ya path/DTO yafanywe **kwa pamoja** (PR pacha FE + BE), si kila mtu peke yake.

---

## 3. Hali ya sasa — Frontend

### 3.1 Mfumo wa API

- Env: `NEXT_PUBLIC_API_URL` (mfano `http://localhost:3000/api/v1`)
- Client: `web/src/lib/api/client.ts` — `fetch` + Bearer token **hiari**
- Ikiwa URL haipo → mock / sessionStorage
- Ikiwa URL ipo lakini module haijaunganishwa → `API_NOT_WIRED` (admin / SaaS)

### 3.2 HTTP paths zilizoelezwa (3 tu)

| Method | Path (frontend) | Inatumika UI? | Maelezo |
|---|---|---|---|
| `GET` | `/tenants` | Hapana (exported tu) | Orodha ya shule / tenants |
| `GET` | `/tenants/:id/report-cards/current` | Ndio (report card page) | Ripoti ya mwanafunzi |
| `POST` | `/auth/login` | **Hapana** — login ni demo local | JWT placeholders |

### 3.3 Facades bila HTTP (sessionStorage)

| Layer | Faili | Inapotaka API halisi |
|---|---|---|
| School admin CRUD | `web/src/lib/admin/api.ts` | Inatupa `API_NOT_WIRED` |
| Platform / SaaS | `web/src/lib/saas/api.ts` | Inatupa `API_NOT_WIRED` |
| Parent / teacher / student MVP | `*-mvp.ts`, mock-data | Hakuna client wa HTTP bado |

### 3.4 Auth (frontend)

- Login: email + `demo-password` kutoka list ya demo users
- Token huwekwa `sessionStorage` lakini **haitumwi** kwenye `apiFetch`
- Roles: `student | parent | teacher | super_admin | school_admin | principal | accountant | sales | support | finance`

---

## 4. Hali ya sasa — Backend

### 4.1 Runtime

- NestJS, port **3000**
- **Hakuna** `app.setGlobalPrefix('api/v1')` (hivi sasa)
- **Hakuna** `enableCors()` kwenye `main.ts` (browser calls zitashindwa cross-origin)
- Prisma `schema.prisma` bado **tupu** (generator tu) — data ni in-memory
- Rate limit: Throttler (~25 req / 60s)

### 4.2 Modules zilizopo

| Module | Base path | Maelezo |
|---|---|---|
| Auth | `/auth` | register, login, forgot/reset/change password, verify email |
| Students | `/students` | CRUD + search + count (tenant-scoped) |
| Teachers | `/teachers` | CRUD + search + count |
| Parents | `/parents` | CRUD, link parent↔student, announcements |
| Classes | `/classes` | CRUD + by year / teacher |
| Attendance | `/attendance` | mark + query by student/class/date |
| Exams | `/exams` | exams + marks (+ bulk marks) |
| Fees | `/fees` | fees + payments |
| Library | `/library` | books / borrow |
| Health | `/health` | public health check |
| Users | (service) | inatumika na auth |

### 4.3 Response envelope (backend standard)

Karibu kila controller inarudisha:

```json
{
  "success": true,
  "message": "…",
  "data": { }
}
```

Frontend bado inatarajia **payload moja kwa moja** (bila `data` wrapper) — hii ni breaking mismatch.

### 4.4 Auth (backend)

| | Backend |
|---|---|
| Login body | `{ email, password, tenantId }` |
| Login result (service) | `{ user, token }` (token **moja**, si access+refresh) |
| Controller wraps | `{ success, message, data: { user, token } }` |
| Roles (register DTO) | `school_owner \| headmaster \| teacher \| parent \| student \| accountant \| librarian \| admin` (+ guards zina roles kama `class_teacher`, `subject_teacher`, …) |

---

## 5. Gap matrix — nini hakifanani

### 5.1 Critical (lazima kabla ya integration yoyote)

| # | Gap | Frontend | Backend | Athari |
|---|---|---|---|---|
| C1 | **Login haijaunganishwa** | Demo local; `loginRequest` haipigiwi | `POST /auth/login` ipo | Hakuna session halisi |
| C2 | **Login body** | `{ schoolCode, email, password }` (placeholder) | `{ email, password, tenantId }` | 400 / unauthorized |
| C3 | **Token shape** | `accessToken` + `refreshToken` | `token` moja | Client haitajua nini kuhifadhi |
| C4 | **Response envelope** | JSON moja kwa moja | `{ success, message, data }` | Parse errors kila mahali |
| C5 | **API prefix** | Inatarajia `/api/v1` | Root paths (`/auth`, …) | 404 |
| C6 | **CORS** | Browser → localhost:3000 | Haijawezeshwa | Blocked by browser |
| C7 | **Bearer header** | Supported lakini haitumwi | JWT guards / roles | 401 baada ya login |

### 5.2 Domain / field mismatches

| Domain | Frontend (admin types) | Backend DTO / entity | Status |
|---|---|---|---|
| Student | `admissionNo`, `classId`, `parentIds`, `dateOfBirth`, status `active\|inactive\|archived` | `tenantId`, `firstName`, `lastName`, `email?`, `dateOfBirth?`; status `active\|inactive\|graduated\|transferred` | ❌ fields + status |
| Parent | `relation`, `gender`, `occupation`, `status` | `userId` (lazima), `firstName`, `lastName`, `email`, `phone`, `address?`, `occupation?` | ❌ |
| Staff / Teacher | `role`, `subjectIds`, `classIds`, `classTeacherOfId`, `hasLogin` | `qualification?`, `hireDate?`, `phone?` — **si staff roles za FE** | ❌ |
| Class | `name`, `section`, `classTeacherId`, `subjectIds` | `name`, `stream?`, `academicYear`, `classTeacherId?`, `capacity?` | ⚠️ `section` vs `stream` |
| Attendance | Period-level (MVP UI) | Day-level: `present\|absent\|late\|excused` + `classId` + `date` | ❌ granularity |
| Fees payment | M-Pesa STK demo UI | `paymentMethod`: mpesa, airtel_money, tigo_pesa, … | ⚠️ UI vs DTO |
| Report card | `GET …/report-cards/current` | **Haipo** | ❌ |
| Tenants list | `GET /tenants` | **Haipo** | ❌ |
| SaaS (plans, billing, tickets, platform staff) | Full UI + mock store | **Haipo** | ❌ |
| Library | Haipo FE | Ipo BE | ⚪ out of FE scope for now |

### 5.3 Role vocabulary (authz)

| Frontend roles | Backend roles (sample) |
|---|---|
| `super_admin`, `school_admin`, `principal`, `accountant`, `sales`, `support`, `finance` | `school_owner`, `headmaster`, `deputy_headmaster`, `academic_master`, `class_teacher`, `subject_teacher`, `admin`, … |
| `teacher`, `parent`, `student` | `teacher`, `parent`, `student` (zinafanana kwa jina, si permissions) |

**Hatari:** Hata baada ya login, RBAC itavunja screens isipokuwa kuna **role mapping table** iliyokubaliwa.

---

## 6. Nini kipo pande zote (overlap)

Vitu hivi vina **wazo sawa** na vinaweza kuunganishwa baada ya contract:

1. Authentication (login / password flows)
2. Students CRUD
3. Parents (+ link kwa wanafunzi)
4. Teachers / staff (baada ya kuunganisha model)
5. Classes
6. Attendance (baada ya kuamua day vs period)
7. Exams + marks
8. Fees + payments

---

## 7. Nini hakipo / hakiko tayari

| Upande | Missing |
|---|---|
| Backend | Tenants API, report-cards API, SaaS/platform APIs, global prefix, CORS, Prisma models halisi, refresh tokens, OpenAPI/Swagger |
| Frontend | HTTP clients kwa modules zote za BE, envelope unwrapping, token injection, role mapping, error handling ya Nest |
| Shared | OpenAPI spec moja, shared TypeScript types package, env docs (`API_URL`, ports) |

---

## 8. Mpango wa kazi uliopendekezwa (kabla / wakati wa “kerebisha”)

### Awamu 0 — Contract freeze (siku 1, pamoja)

- [ ] Andika **OpenAPI 3** (au Notion/Google Doc + examples) yenye:
  - Base URL: `http://localhost:3000/api/v1`
  - Envelope: `{ success, message?, data, meta? }`
  - Error: `{ success: false, message, statusCode, errors? }`
- [ ] Role mapping FE ↔ BE
- [ ] Login request/response final
- [ ] Student / Class / Attendance field dictionary

**Definition of done:** Wote wawili wametia sahihi “hatubadili path/fields bila PR pacha”.

### Awamu 1 — Platform plumbing (BE lead + FE assist)

- [ ] BE: `setGlobalPrefix('api/v1')`, `enableCors`, ValidationPipe
- [ ] FE: `apiFetch` unwrap `data`, always send Bearer, store `token`
- [ ] Shared: health check `GET /api/v1/health` kutoka FE

### Awamu 2 — Auth end-to-end

- [ ] FE login page → `POST /api/v1/auth/login`
- [ ] Map `user.role` → portal `homePath`
- [ ] Logout clears token; 401 → login

### Awamu 3 — School core (moja baada ya nyingine)

Order iliyopendekezwa:

1. Students  
2. Classes  
3. Parents (+ link)  
4. Teachers  
5. Attendance (amua: day-first au period v2)  
6. Exams / marks  
7. Fees / payments  

Kila item: DTO alignment → BE merge → FE client → UI replace mock.

### Awamu 4 — Nice-to-have baadaye

- Report cards endpoint  
- Tenants / multi-school switcher  
- SaaS platform APIs  
- Library UI  
- Prisma persistence (replace in-memory)

---

## 9. Ownership matrix (proposal)

| Workstream | Owner | Reviewer |
|---|---|---|
| OpenAPI + envelope + roles map | Lead / pamoja | Wote |
| Nest prefix, CORS, ValidationPipe, Auth DTOs | Backend | Frontend |
| `apiFetch`, login wire, token storage | Frontend | Backend |
| Students / Classes / Parents clients | Frontend | Backend |
| Attendance model decision (day vs period) | Product + both | — |
| Prisma schema + migrate from in-memory | Backend | — |
| SaaS APIs | Backend (baadaye) | Frontend |

---

## 10. Hatari na mawasiliano

1. **Kuendelea ku-build UI/mock** bila contract → gap inazidi.  
2. **Kila mtu kubadili majina ya fields peke yake** → integration breaks.  
3. **In-memory BE** → data inapotea baada ya restart; demo kwa stakeholders iwe wazi.  
4. **Database branch** (`database` kwenye SMS repo) bado haijaunganishwa `main` — sync DB work mapema.

---

## 11. Appendix — Quick reference

### Frontend HTTP stubs

```
GET  {API}/tenants
GET  {API}/tenants/:tenantId/report-cards/current
POST {API}/auth/login
```

### Backend auth (current)

```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/change-password
POST /auth/verify-email
POST /auth/send-verification
```

### Backend resource pattern (typical)

```
POST   /students
GET    /students/:tenantId
GET    /students/:tenantId/:id
PUT    /students/:tenantId/:id
DELETE /students/:tenantId/:id
```

*(Teachers, classes, attendance, exams, fees zinafuata pattern sawa.)*

### Env (pendekezo baada ya Awamu 1)

```bash
# Frontend web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Backend
PORT=3000
JWT_SECRET=...
```

---

## 12. Uamuzi unaohitajika kutoka lead (kabla ya coding)

Tafadhali thibitisha na timu:

1. **Envelope** — tutatumia `{ success, data }` kama standard?  
2. **Prefix** — `/api/v1`?  
3. **Login identity** — `tenantId` au `schoolCode`?  
4. **Attendance** — day-level sasa, period baadaye?  
5. **Token** — JWT moja sasa, refresh baadaye?  
6. **Role names** — BE names ofisi, FE ina-map; au kuunganisha majina?

---

**Signed-off as current-state snapshot:** 20 Aug 2026 · Sources: `ZCampus/edunexus` (`main`), `ZCampus/school-management-system` (`main`)  

*Ripoti hii ni snapshot — isisasishwe bila tarehe mpya baada ya Awamu 0.*
