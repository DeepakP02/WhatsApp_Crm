# BUSINESS RULES
## WhatsApp Multi-Channel CRM – Backend

---

## 1. Authentication Rules

- All user passwords **must** be hashed with `bcrypt` (min 10 rounds) before storing.
- Plaintext passwords **must never** be stored or logged.
- JWTs expire after **7 days**. After expiry, the user must log in again.
- A user with `INACTIVE` status **cannot** authenticate—login must be rejected with `401`.
- The `JWT_SECRET` must be set via environment variable. No fallback value in code.
- Logout is **client-side only** (delete the token). No server-side token invalidation.

---

## 2. Role-Based Access Control (RBAC)

Access is enforced at the middleware layer per endpoint. The hierarchy is:

```
SUPER_ADMIN  ──► All modules, all data
    │
    ADMIN  ──► Channel setup, routing, AI config, working hours, templates, user management (by company)
    │
    MANAGER  ──► Analytics, funnel, country reports, SLA, team overview
    │
    TEAM_LEADER  ──► Team's leads, reassignment, counselor performance
    │
    COUNSELOR  ──► Only their own assigned leads, notes, calls, inbox
    │
    CUSTOMER_SUPPORT  ──► Inbox, new lead creation, lead assignment, AI status
```

- **Super Admin** can impersonate or view any resource.
- **Admin** cannot access Super Admin routes (audit logs, billing, system KPIs).
- **Counselor** can only read/write leads where `assignedToId === their userId`.
- **Team Leader** can only view leads of team members in their team.
- **Manager** sees aggregated data only—no individual lead modification.

---

## 3. Lead Lifecycle Rules

### Stages (strict order enforced on validation, not on DB level):
```
NEW → CONTACTED → QUALIFIED → CONVERTED → ENROLLED
                                                    ↘ LOST (can transition from any stage)
```

- A lead **cannot** go backwards in stage (e.g., QUALIFIED → NEW is rejected).
- `LOST` is a terminal state. A lost lead **cannot** be moved to another stage without Super Admin override.
- `score` is set by the AI Qualification module; manual override allowed by Manager and above.

### Lead Assignment Rules:
- A lead **must** have an assignedTo user before it reaches the `CONTACTED` stage.
- **Counselor** cannot assign leads to others—only a Team Leader or above can reassign.
- **Bulk assign** is limited to Super Admin, Admin, and Team Leader.
- When a lead is reassigned, an `Activity` record is automatically created.

### Lead Scoring:
| Score Range | Category |
|---|---|
| 0–40 | Cold |
| 41–70 | Warm |
| 71–100 | Hot |

---

## 4. Inbox / Conversation Rules

- A `Conversation` is linked to one `Lead` and one `channel`.
- One lead can have **multiple conversations** across different channels.
- `unreadCount` is incremented when a message with `direction = INBOUND` is received.
- `unreadCount` is reset to `0` when the conversation is opened by a Counselor or Support agent.
- Messages cannot be deleted.
- A Support or Counselor user **cannot** see conversations assigned to someone else's lead.

---

## 5. AI Qualification Rules

- AI Qualification is **one per Lead** (unique constraint on `leadId`).
- `score` is an integer between 0–100.
- `category` is derived from the score automatically (Hot / Warm / Cold).
- `answers` is stored as a JSON object (key-value of qualification question answers).
- AI summary is a plain text string generated based on answers.
- If AI qualification does not exist for a lead, the lead is considered **unqualified**.

---

## 6. Notes & Activities

- Any user with access to a lead can add a note.
- Notes **cannot** be edited or deleted after creation.
- **Activity logs** are created automatically by the system for:
  - Lead created
  - Lead assigned / reassigned
  - Stage changed
  - Call logged
  - Note added
- Users **cannot** manually create activity log entries via the API.

---

## 7. Call Logging Rules

- Calls are logged per lead.
- `duration` is in **seconds** (nullable if the call didn't connect).
- `outcome` is a free-text string (e.g., "No Answer", "Interested", "Scheduled Follow-up").
- Counselors can only log calls for leads **assigned to them**.

---

## 8. Template Rules

- Templates are scoped per `channel` (WHATSAPP / FACEBOOK / WEBSITE).
- Templates can be created by **Admin and above**.
- Templates can be **read** by Counselor and Customer Support.
- Deletion of a template is a **soft delete** (set `deletedAt`).
- Template names must be unique per channel.

---

## 9. Routing Rules

- Routing is defined per **country**.
- A routing rule maps: `Country → Team`.
- Within the team, counselors are assigned using one of two strategies:
  - `ROUND_ROBIN`: Leads distributed equally in order.
  - `LOAD_BASED`: Leads go to the counselor with the fewest active leads.
- If no routing rule exists for a country, the lead is left **unassigned**.
- Only Admin and Super Admin can create/update routing rules.

---

## 10. SLA Monitoring Rules

- SLA is tracked at the **conversation** level.
- `lastResponseAt` is updated every time an outbound message is sent.
- If the time since `lastResponseAt` exceeds `SlaConfig.responseMinutes`, `isBreached = true`.
- SLA breach check is performed on API fetch (not via cron, unless a background job is added later).
- SLA Config is set by **Admin/Super Admin** and is a global system-wide setting.

---

## 11. Audit Log Rules

- Audit logs are **immutable** (insert-only, no updates or deletes).
- An audit log entry is created for every:
  - User login
  - User creation/update/deactivation
  - Lead assignment or bulk assignment
  - Routing rule change
  - Template creation/deletion
  - AI config update
  - Password change
- Audit logs store: `userId`, `action`, `module`, `detail`, `ip`, `userAgent`, `createdAt`.
- Only **Super Admin** can read audit logs.

---

## 12. Dashboard KPI Rules

| Role | KPI Scope |
|---|---|
| Super Admin | Platform-wide: total clients, leads, revenue, active channels |
| Admin | System health: user count, active channels, pending setups |
| Manager | Team performance: leads today, qualified, converted, enrolled |
| Team Leader | Own team: team lead count, pending replies, SLA breaches |
| Counselor | Personal: assigned leads, hot leads, follow-ups today |
| Customer Support | Queue: new messages, unassigned leads, AI active chats |

- All KPI endpoints are **read-only**.
- KPIs are computed in real time (no cached values).

---

## 13. Billing Rules

- Billing is structural only (no payment gateway integration).
- Each subscription plan has: name, price, cycle, status, start/end dates.
- Only **Super Admin** can manage billing plans.
- Admin cannot modify billing.

---

## 14. Country Access Control

- Each user can be assigned a **country** field.
- Counselors only see leads where `lead.country === user.country`.
- Team Leaders only see their team's leads.
- Managers and above see all countries.
- Country access is enforced at the service layer via query filtering.
