# PROJECT OVERVIEW
## WhatsApp Multi-Channel CRM – Backend

---

## 1. Purpose

This backend serves as the single API layer for the WhatsApp Multi-Channel CRM platform. It provides secure, role-aware REST APIs consumed by the existing React frontend. No UI logic lives here—this layer handles:

- Authentication & authorization
- Business logic enforcement
- Data persistence via Prisma + MySQL
- Audit logging
- Role-based KPI aggregation

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| ORM | Prisma |
| Database | MySQL |
| Auth | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Language | JavaScript (ESModules/CommonJS) |

---

## 3. Roles & Access Summary

| Role | Primary Scope |
|---|---|
| **Super Admin** | Full access: all modules, audit logs, billing, user management |
| **Admin** | Configuration: channels, routing, AI config, working hours, templates |
| **Manager** | Analytics: funnel, country reports, SLA, conversions |
| **Team Leader** | Team management: leads, reassignments, counselor KPIs |
| **Counselor** | Own leads: stages, notes, calls, inbox |
| **Customer Support** | Inbox: conversations, lead creation, AI status |

---

## 4. Core Modules

| # | Module | Description |
|---|---|---|
| 1 | **Auth** | Login, JWT, password change, profile |
| 2 | **Users & Teams** | CRUD, role assignment, country access |
| 3 | **Leads** | Full lifecycle management with 6 stages |
| 4 | **Unified Inbox** | Conversations + messages across WhatsApp, FB, Website |
| 5 | **AI Qualification** | Score, category (Hot/Warm/Cold), summaries |
| 6 | **Notes & Activities** | Per-lead notes + automated activity log |
| 7 | **Call Logging** | Log calls per lead, view history |
| 8 | **Templates** | Quick replies per channel |
| 9 | **Routing** | Country → Team → Counselor, round-robin, load-based |
| 10 | **SLA Monitoring** | Response time tracking, breach detection |
| 11 | **Dashboards** | Role-specific KPI summary APIs |
| 12 | **Audit Logs** | All admin/super-admin actions logged |
| 13 | **Billing** | Subscription structure, plan metadata |

---

## 5. Development Phases

| Phase | Scope |
|---|---|
| **Phase 1** | Super Admin + Auth (foundation) |
| **Phase 2** | Admin (configuration modules) |
| **Phase 3** | Manager (analytics, reporting) |
| **Phase 4** | Team Leader (team monitoring) |
| **Phase 5** | Counselor (lead-level operations) |
| **Phase 6** | Customer Support (inbox, lead creation) |

---

## 6. Environment Variables

```
DATABASE_URL=mysql://user:password@host:port/dbname
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

No environment-specific branching. Single `.env` file works for both local and Railway deployment.

---

## 7. Railway Deployment Notes

- Server listens on `process.env.PORT || 3000`
- `DATABASE_URL` is the only database configuration required
- No Redis, no sessions, no in-memory state
- Prisma migrations are run via `npx prisma migrate deploy` before starting

---

## 8. Constraints

- ❌ No mock/seed data
- ❌ No hardcoded users or credentials
- ❌ No Redis or session storage
- ❌ No TypeScript
- ❌ No modifications to the frontend
- ✅ All data from MySQL via Prisma
- ✅ JWT for all protected routes
- ✅ Role-based middleware on every endpoint
