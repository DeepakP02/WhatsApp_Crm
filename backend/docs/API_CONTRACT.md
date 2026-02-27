# API CONTRACT
## WhatsApp Multi-Channel CRM – Backend

---

> **Base URL:** `http://localhost:3000/api/v1`
> **Authentication:** All routes (except `/auth/login`) require `Authorization: Bearer <token>` header.
> **Standard Error Response:**
> ```json
> { "success": false, "error": "Description", "code": 400 }
> ```

---

## MODULE 1: AUTH

### POST `/auth/login`
Login and receive a JWT.

**Access:** Public

**Request Body:**
```json
{
  "email": "super.admin@crm.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": 1,
      "uuid": "abc-123",
      "name": "Super Admin",
      "email": "super.admin@crm.com",
      "role": "SUPER_ADMIN",
      "country": null
    }
  }
}
```

**Errors:**
- `401` – Invalid credentials or inactive account

---

### GET `/auth/profile`
Get currently authenticated user's profile.

**Access:** All authenticated roles

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "super.admin@crm.com",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "country": null,
    "team": null
  }
}
```

---

### PUT `/auth/change-password`
Change authenticated user's password.

**Access:** All authenticated roles

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

**Response:**
```json
{ "success": true, "message": "Password updated successfully" }
```

---

## MODULE 2: USERS & TEAMS

### GET `/users`
List all users with optional filters.

**Access:** SUPER_ADMIN, ADMIN

**Query Params:** `?role=COUNSELOR&status=ACTIVE&country=India&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [...users],
  "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```

---

### POST `/users`
Create a new user.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@crm.com",
  "password": "Initial@123",
  "role": "COUNSELOR",
  "teamId": 2,
  "country": "India"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": 10, "uuid": "...", "name": "John Doe", "email": "john@crm.com", "role": "COUNSELOR" }
}
```

---

### GET `/users/:id`
Get a single user by ID.

**Access:** SUPER_ADMIN, ADMIN

---

### PUT `/users/:id`
Update a user.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:** (any user fields)
```json
{ "name": "Updated Name", "role": "MANAGER", "country": "UAE" }
```

---

### PATCH `/users/:id/status`
Activate or deactivate a user.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{ "status": "INACTIVE" }
```

---

### GET `/teams`
List all teams.

**Access:** SUPER_ADMIN, ADMIN, MANAGER, TEAM_LEADER

---

### POST `/teams`
Create a team.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{ "name": "India Sales Team", "country": "India", "leaderId": 5 }
```

---

### PUT `/teams/:id`
Update team details.

**Access:** SUPER_ADMIN, ADMIN

---

### POST `/teams/:id/members`
Add a user to a team.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{ "userId": 10 }
```

---

## MODULE 3: LEADS

### GET `/leads`
Get all leads with filters.

**Access:** Role-filtered (Counselors see only their own; Team Leaders see their team's)

**Query Params:** `?stage=NEW&country=India&assignedTo=5&search=John&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "phone": "+919876543210",
      "email": "jane@example.com",
      "country": "India",
      "source": "WhatsApp",
      "program": "MBA",
      "intake": "Jan 2025",
      "budget": 50000,
      "score": 78,
      "stage": "QUALIFIED",
      "assignedTo": { "id": 5, "name": "Raj" },
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 80, "totalPages": 4 }
}
```

---

### POST `/leads`
Create a new lead.

**Access:** SUPER_ADMIN, ADMIN, CUSTOMER_SUPPORT

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+919876543210",
  "email": "jane@example.com",
  "country": "India",
  "source": "WhatsApp",
  "program": "MBA",
  "intake": "Jan 2025",
  "budget": 50000
}
```

---

### GET `/leads/:id`
Get a single lead with all details.

**Access:** Role-filtered

---

### PUT `/leads/:id`
Update lead details.

**Access:** SUPER_ADMIN, ADMIN, TEAM_LEADER, COUNSELOR (own leads only)

---

### PATCH `/leads/:id/stage`
Update a lead's stage.

**Access:** COUNSELOR (own leads), TEAM_LEADER (team leads), ADMIN, SUPER_ADMIN

**Request Body:**
```json
{ "stage": "QUALIFIED" }
```

**Errors:**
- `400` – Invalid stage transition (e.g., going backward)
- `403` – Access denied for this lead

---

### PATCH `/leads/:id/assign`
Assign or reassign a lead to a user.

**Access:** SUPER_ADMIN, ADMIN, TEAM_LEADER

**Request Body:**
```json
{ "assignedToId": 7 }
```

---

### POST `/leads/bulk-assign`
Bulk assign multiple leads.

**Access:** SUPER_ADMIN, ADMIN, TEAM_LEADER

**Request Body:**
```json
{
  "leadIds": [1, 2, 3, 4],
  "assignedToId": 7
}
```

---

## MODULE 4: UNIFIED INBOX

### GET `/inbox/conversations`
Get all conversations (filtered by role).

**Access:** SUPER_ADMIN, ADMIN, COUNSELOR, CUSTOMER_SUPPORT

**Query Params:** `?channel=WHATSAPP&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "lead": { "id": 1, "name": "Jane Smith", "phone": "+91..." },
      "channel": "WHATSAPP",
      "unreadCount": 3,
      "lastMessage": "Hello, I'm interested",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### GET `/inbox/conversations/:id/messages`
Get all messages in a conversation. Resets `unreadCount` to 0.

**Access:** Role-filtered

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sender": { "id": null, "name": "Lead" },
      "body": "Hello, I'm interested",
      "direction": "INBOUND",
      "sentAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST `/inbox/conversations/:id/messages`
Send a message in a conversation.

**Access:** COUNSELOR, CUSTOMER_SUPPORT

**Request Body:**
```json
{ "body": "Thank you for reaching out!" }
```

---

### GET `/inbox/unread-count`
Get total unread message count for the current user.

**Access:** COUNSELOR, CUSTOMER_SUPPORT

**Response:**
```json
{ "success": true, "data": { "totalUnread": 12 } }
```

---

## MODULE 5: AI QUALIFICATION

### POST `/ai/:leadId/qualify`
Store AI qualification results for a lead.

**Access:** ADMIN, SUPER_ADMIN, COUNSELOR (own leads)

**Request Body:**
```json
{
  "answers": {
    "budget": "50000",
    "program": "MBA",
    "timeline": "Immediate",
    "source": "WhatsApp"
  },
  "score": 82,
  "summary": "High intent lead. Budget confirmed. Immediate start preferred."
}
```

---

### GET `/ai/:leadId/summary`
Get AI qualification summary for a lead.

**Access:** Role-filtered (same lead access rules as leads)

**Response:**
```json
{
  "success": true,
  "data": {
    "leadId": 1,
    "score": 82,
    "category": "Hot",
    "answers": { ... },
    "summary": "High intent lead...",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## MODULE 6: NOTES & ACTIVITIES

### POST `/leads/:leadId/notes`
Add a note to a lead.

**Access:** Any role with lead access

**Request Body:**
```json
{ "content": "Counselor called, interested in January intake." }
```

---

### GET `/leads/:leadId/notes`
Get all notes for a lead.

**Access:** Role-filtered

---

### GET `/leads/:leadId/activities`
Get activity log for a lead.

**Access:** Role-filtered

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "STAGE_CHANGE",
      "description": "Stage changed from NEW to CONTACTED",
      "user": { "id": 5, "name": "Raj" },
      "createdAt": "2024-01-15T10:05:00Z"
    }
  ]
}
```

---

## MODULE 7: CALL LOGGING

### POST `/leads/:leadId/calls`
Log a call for a lead.

**Access:** COUNSELOR (own leads), TEAM_LEADER, ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "duration": 180,
  "outcome": "Interested – scheduled follow-up",
  "notes": "Discussed MBA program. Requested brochure.",
  "calledAt": "2024-01-15T10:00:00Z"
}
```

---

### GET `/leads/:leadId/calls`
Get call history for a lead.

**Access:** Role-filtered

---

## MODULE 8: TEMPLATES

### GET `/templates`
List all templates.

**Access:** All authenticated roles

**Query Params:** `?channel=WHATSAPP`

---

### POST `/templates`
Create a template.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{
  "name": "Welcome Message",
  "body": "Hello {{name}}, welcome to our CRM!",
  "channel": "WHATSAPP"
}
```

---

### PUT `/templates/:id`
Update a template.

**Access:** SUPER_ADMIN, ADMIN

---

### DELETE `/templates/:id`
Soft-delete a template.

**Access:** SUPER_ADMIN, ADMIN

---

## MODULE 9: ROUTING RULES

### GET `/routing`
List all routing rules.

**Access:** SUPER_ADMIN, ADMIN

---

### POST `/routing`
Create a routing rule.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{
  "country": "India",
  "teamId": 2,
  "strategy": "ROUND_ROBIN"
}
```

---

### PUT `/routing/:id`
Update a routing rule.

**Access:** SUPER_ADMIN, ADMIN

---

### DELETE `/routing/:id`
Delete a routing rule.

**Access:** SUPER_ADMIN, ADMIN

---

### POST `/routing/run`
Manually trigger routing for unassigned leads.

**Access:** SUPER_ADMIN, ADMIN

---

## MODULE 10: SLA MONITORING

### GET `/sla`
Get SLA status for all conversations.

**Access:** SUPER_ADMIN, ADMIN, MANAGER, TEAM_LEADER

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "conversationId": 1,
      "lead": { "id": 1, "name": "Jane" },
      "lastResponseAt": "2024-01-15T09:00:00Z",
      "isBreached": true,
      "minutesSinceLastResponse": 125
    }
  ]
}
```

---

### GET `/sla/config`
Get SLA configuration.

**Access:** SUPER_ADMIN, ADMIN

---

### PUT `/sla/config`
Update SLA configuration.

**Access:** SUPER_ADMIN, ADMIN

**Request Body:**
```json
{
  "responseMinutes": 60,
  "escalateMinutes": 120
}
```

---

## MODULE 11: DASHBOARDS (ROLE-WISE KPIs)

### GET `/dashboard`
Returns role-specific KPI summary for the authenticated user.

**Access:** All authenticated roles

#### Super Admin Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 120,
    "totalLeads": 4580,
    "activeChannels": 14,
    "totalTeams": 8,
    "leadsToday": 43,
    "revenueThisMonth": 84000
  }
}
```

#### Manager Response:
```json
{
  "success": true,
  "data": {
    "leadsToday": 43,
    "qualified": 120,
    "converted": 85,
    "enrolled": 60,
    "slaBreaches": 5,
    "conversionRate": 70.8
  }
}
```

#### Team Leader Response:
```json
{
  "success": true,
  "data": {
    "teamLeads": 230,
    "pendingReplies": 18,
    "slaBreaches": 3,
    "counselors": 6
  }
}
```

#### Counselor Response:
```json
{
  "success": true,
  "data": {
    "assignedLeads": 42,
    "hotLeads": 15,
    "followUpsToday": 8,
    "unreadMessages": 4
  }
}
```

#### Customer Support Response:
```json
{
  "success": true,
  "data": {
    "newMessages": 22,
    "unassignedLeads": 9,
    "aiActiveChats": 5
  }
}
```

---

## MODULE 12: AUDIT LOGS

### GET `/audit`
Get system-wide audit logs.

**Access:** SUPER_ADMIN only

**Query Params:** `?module=Auth&userId=1&dateFrom=2024-01-01&dateTo=2024-02-01&page=1&limit=50`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": { "id": 1, "name": "Super Admin" },
      "action": "USER_CREATED",
      "module": "Users",
      "detail": "Created user john@crm.com with role COUNSELOR",
      "ip": "192.168.1.1",
      "userAgent": "Chrome on macOS",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 200, "totalPages": 4 }
}
```

---

## MODULE 13: BILLING

### GET `/billing/plans`
List all subscription plans.

**Access:** SUPER_ADMIN

---

### POST `/billing/plans`
Create a new billing plan.

**Access:** SUPER_ADMIN

**Request Body:**
```json
{
  "planName": "Enterprise Plus",
  "price": 1200.00,
  "cycle": "MONTHLY"
}
```

---

### PUT `/billing/plans/:id`
Update a billing plan.

**Access:** SUPER_ADMIN

---

### GET `/billing/subscriptions`
List all active subscriptions.

**Access:** SUPER_ADMIN

---

## ROLE PERMISSION MATRIX

| Endpoint | SA | ADMIN | MANAGER | TL | COUNSELOR | SUPPORT |
|---|---|---|---|---|---|---|
| POST `/auth/login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET `/auth/profile` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET `/users` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST `/users` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET `/leads` | ✅ | ✅ | ✅ | ✅ (team) | ✅ (own) | ✅ |
| POST `/leads` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| PATCH `/leads/:id/stage` | ✅ | ✅ | ❌ | ✅ | ✅ (own) | ❌ |
| PATCH `/leads/:id/assign` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| POST `/leads/bulk-assign` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| GET `/inbox/conversations` | ✅ | ✅ | ❌ | ❌ | ✅ (own) | ✅ |
| POST `/inbox/.../messages` | ✅ | ✅ | ❌ | ❌ | ✅ (own) | ✅ |
| POST `/templates` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET `/templates` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST `/routing` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET `/sla` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET `/audit` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GET `/billing` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Legend:** SA = Super Admin, TL = Team Leader
