# EduNexus

Multi-tenant school management for African schools. Attendance, marks, fees, and role-based portals that still work on weak networks.

## Apps

- `web/` — Next.js 15 mock-first MVP

## Portals

1. **Super Admin Portal** (`/super-admin`) — SaaS owner: schools, plans, billing, tickets, team
2. **School Admin Portal** (`/admin`) — tenant control center
3. **End-user portals** — teacher, parent, student (Phase 2)

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

Demo password: `demo-password`

### Super Admin Portal

| Role | Email |
|---|---|
| Super Admin | `super@edunexus.app` |
| Sales | `sales@edunexus.app` |
| Support | `support@edunexus.app` |
| Finance | `finance@edunexus.app` |

Self-service trial: [http://localhost:3000/register](http://localhost:3000/register)

### School Admin Portal

| Role | Email |
|---|---|
| School Admin | `admin@mlimani.ac.tz` |
| Principal | `mtei@mlimani.ac.tz` |
| Teacher | `kimaro@mlimani.ac.tz` |
| Accountant | `accounts@mlimani.ac.tz` |

### Phase 2 portals

| Role | Email |
|---|---|
| Student | `neema.juma@mlimani.ac.tz` |
| Parent | `asha.juma@example.com` |
