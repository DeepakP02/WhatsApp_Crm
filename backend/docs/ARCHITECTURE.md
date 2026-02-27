# ARCHITECTURE
## WhatsApp Multi-Channel CRM – Backend

---

## 1. Folder Structure

```
backend/
├── src/
│   ├── app.js                    # Express app setup, middleware registration
│   ├── controllers/              # Request handlers (thin layer)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── lead.controller.js
│   │   ├── inbox.controller.js
│   │   ├── ai.controller.js
│   │   ├── note.controller.js
│   │   ├── call.controller.js
│   │   ├── template.controller.js
│   │   ├── routing.controller.js
│   │   ├── sla.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── audit.controller.js
│   │   └── billing.controller.js
│   ├── routes/                   # Express routers
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── lead.routes.js
│   │   ├── inbox.routes.js
│   │   ├── ai.routes.js
│   │   ├── note.routes.js
│   │   ├── call.routes.js
│   │   ├── template.routes.js
│   │   ├── routing.routes.js
│   │   ├── sla.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── audit.routes.js
│   │   └── billing.routes.js
│   ├── services/                 # Business logic (thick layer)
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── lead.service.js
│   │   ├── inbox.service.js
│   │   ├── ai.service.js
│   │   ├── note.service.js
│   │   ├── call.service.js
│   │   ├── template.service.js
│   │   ├── routing.service.js
│   │   ├── sla.service.js
│   │   ├── dashboard.service.js
│   │   ├── audit.service.js
│   │   └── billing.service.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── role.middleware.js     # Role-based access control (RBAC)
│   │   ├── audit.middleware.js    # Action audit logging
│   │   └── error.middleware.js    # Global error handler
│   ├── validators/               # Input validation schemas
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── lead.validator.js
│   │   └── ...
│   ├── config/
│   │   ├── prisma.js             # Prisma Client singleton
│   │   └── jwt.js                # JWT helpers (sign, verify)
│   ├── utils/
│   │   ├── response.js           # Standardized API response helpers
│   │   ├── pagination.js         # Pagination utility
│   │   └── logger.js             # Console logger
│   ├── prisma/
│   │   └── schema.prisma         # Single Prisma schema
│   └── constants/
│       ├── roles.js              # Role enums
│       ├── stages.js             # Lead stage enums
│       └── channels.js           # Channel type enums
├── server.js                     # Entry point
├── package.json
├── .env
└── docs/                         # This documentation folder
```

---

## 2. Request Lifecycle

```
Client Request
    │
    ▼
Express Router (routes/)
    │
    ▼
auth.middleware.js      ← Verifies JWT token
    │
    ▼
role.middleware.js       ← Checks role permission
    │
    ▼
Validator (validators/)  ← Input validation
    │
    ▼
Controller (controllers/) ← Handles HTTP request/response
    │
    ▼
Service (services/)      ← Business logic, Prisma queries
    │
    ▼
Prisma ORM → MySQL
    │
    ▼
Response (utils/response.js)
```

---

## 3. Database Entities (Prisma Models)

### User
```
User {
  id          Int        PK
  uuid        String     unique
  name        String
  email       String     unique
  password    String     (bcrypt hashed)
  role        Role       enum
  status      Status     (ACTIVE | INACTIVE)
  teamId      Int?       FK → Team.id
  country     String?
  createdAt   DateTime
  updatedAt   DateTime
}
```

### Team
```
Team {
  id          Int        PK
  name        String
  country     String?
  leaderId    Int?       FK → User.id
  members     User[]
  createdAt   DateTime
}
```

### Lead
```
Lead {
  id           Int        PK
  name         String
  phone        String
  email        String?
  country      String
  source       String
  program      String?
  intake       String?
  budget       Float?
  score        Int?
  stage        LeadStage  enum
  assignedToId Int?       FK → User.id
  status       String
  createdAt    DateTime
  updatedAt    DateTime
}
```

### Conversation
```
Conversation {
  id          Int        PK
  leadId      Int        FK → Lead.id
  channel     Channel    enum (WHATSAPP | FACEBOOK | WEBSITE)
  unreadCount Int        default 0
  lastMessage String?
  createdAt   DateTime
  updatedAt   DateTime
}
```

### Message
```
Message {
  id              Int          PK
  conversationId  Int          FK → Conversation.id
  senderId        Int?         FK → User.id
  body            String
  direction       Direction    enum (INBOUND | OUTBOUND)
  status          String
  sentAt          DateTime
}
```

### AIQualification
```
AIQualification {
  id          Int        PK
  leadId      Int        FK → Lead.id (unique)
  answers     Json
  score       Int
  category    String     (Hot | Warm | Cold)
  summary     String?
  createdAt   DateTime
  updatedAt   DateTime
}
```

### Note
```
Note {
  id          Int        PK
  leadId      Int        FK → Lead.id
  authorId    Int        FK → User.id
  content     String
  createdAt   DateTime
}
```

### Activity
```
Activity {
  id          Int        PK
  leadId      Int        FK → Lead.id
  userId      Int        FK → User.id
  type        String
  description String
  createdAt   DateTime
}
```

### CallLog
```
CallLog {
  id          Int        PK
  leadId      Int        FK → Lead.id
  userId      Int        FK → User.id
  duration    Int?       (seconds)
  outcome     String?
  notes       String?
  calledAt    DateTime
}
```

### Template
```
Template {
  id          Int        PK
  name        String
  body        String
  channel     Channel    enum
  createdById Int        FK → User.id
  createdAt   DateTime
  updatedAt   DateTime
}
```

### RoutingRule
```
RoutingRule {
  id        Int        PK
  country   String
  teamId    Int        FK → Team.id
  strategy  String     (ROUND_ROBIN | LOAD_BASED)
  createdAt DateTime
}
```

### SlaConfig
```
SlaConfig {
  id              Int        PK
  responseMinutes Int
  escalateMinutes Int
  createdAt       DateTime
}
```

### SlaStatus
```
SlaStatus {
  id                Int        PK
  conversationId    Int        FK → Conversation.id
  lastResponseAt    DateTime?
  isBreached        Boolean    default false
  updatedAt         DateTime
}
```

### AuditLog
```
AuditLog {
  id          Int        PK
  userId      Int        FK → User.id
  action      String
  module      String
  detail      String?
  ip          String?
  userAgent   String?
  createdAt   DateTime
}
```

### Billing
```
Billing {
  id          Int        PK
  planName    String
  price       Float
  cycle       String     (MONTHLY | ANNUALLY)
  status      String
  startDate   DateTime
  endDate     DateTime?
  createdAt   DateTime
}
```

---

## 4. Role Enums

```javascript
// src/constants/roles.js
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEAM_LEADER: 'TEAM_LEADER',
  COUNSELOR: 'COUNSELOR',
  CUSTOMER_SUPPORT: 'CUSTOMER_SUPPORT'
}
```

---

## 5. Lead Stage Enums

```javascript
// src/constants/stages.js
const LEAD_STAGES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  ENROLLED: 'ENROLLED',
  LOST: 'LOST'
}
```

---

## 6. Channel Enums

```javascript
// src/constants/channels.js
const CHANNELS = {
  WHATSAPP: 'WHATSAPP',
  FACEBOOK: 'FACEBOOK',
  WEBSITE: 'WEBSITE'
}
```

---

## 7. Standard Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}

// Error
{
  "success": false,
  "error": "Error description",
  "code": 400
}

// Paginated List
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 8. JWT Strategy

- **Access Token** expires in `7d`
- Token carries: `{ userId, role, email }`
- All protected routes require `Authorization: Bearer <token>` header
- No refresh tokens (stateless design)
