# Multi-Channel CRM: Data Flow Overview

This document provides a technical overview of how data moves through the Multi-Channel CRM system, covering internal architecture and external integrations.

---

## 1. High-Level Architecture
The system follows a typical MERN-style architecture (Node/Express/MySQL) with Prisma as the ORM.

*   **Frontend (Public/Client)**: React + Vite + Tailwind. Uses **React Query** for server state and **Zustand** for local persistent state (auth).
*   **Backend (Core)**: Node.js Express server. Encapsulates business logic in **Services** and entry points in **Controllers**.
*   **Data Layer**: MySQL database managed via **Prisma**.
*   **External Gateways**: Integrations with Meta (WhatsApp/Facebook) and custom Website Widgets.

---

## 2. Core Data Flows

### A. Lead Ingestion Flow (Inbound)
1.  **External Event**: A customer sends a message on WhatsApp or Facebook.
2.  **Webhook**: The external provider hits a Backend Webhook endpoint (e.g., `/api/webhook/whatsapp`).
3.  **Validation**: Backend validates the signature and payload.
4.  **Database Update**:
    *   Creates/Updates a `Lead` record.
    *   Creates/Updates a `Conversation`.
    *   Appends a new `Message` record.
    *   Resets/Updates `SlaStatus` (tracking response time).
5.  **Frontend Notification**: (Via Polling/React Query) The **Customer Support** or **Counselor** dashboard refreshes, showing the new message in the **Unified Inbox**.

### B. User Authentication Flow
1.  **Login**: User submits credentials via the `LoginPage`.
2.  **Authentication**: Backend checks `User` table, verifies hashed password (Bcrypt).
3.  **Token Generation**: Backend signs a **JWT** containing `userId` and `role`.
4.  **Session Management**:
    *   Frontend receives JWT and stores it in `localStorage` via **Zustand**.
    *   Subsequent API requests include the JWT in the `Authorization: Bearer <token>` header.
5.  **Authorization**: Backend middleware (`authenticateJWT` + `authorizeRole`) verifies permissions for every protected route.

### C. Lead Management & Dispatch Flow
1.  **Action**: A **Super Admin** or **Support User** clicks "Assign Lead" to a Counselor.
2.  **API Call**: Frontend sends `POST /api/super-admin/dispatch` with `leadId` and `counselorId`.
3.  **Transaction**: Backend executes a Prisma Transaction:
    *   Updates `Lead.assignedToId`.
    *   Changes `Lead.stage` to `CONTACTED`.
    *   Inserts a new `Activity` log entry.
4.  **Audit**: `AuditLog` middleware captures the assignment for the global security log.

### D. Outbound Communication Flow
1.  **Compose**: A **Counselor** types a message in the `Inbox` and hits send.
2.  **Processing**: Backend saves the `Message` (direction: OUTBOUND) to the DB.
3.  **External Dispatch**: Backend calls the **Meta Graph API** (or similar) to send the actual message to the customer's phone.
4.  **Status Sync**: Upon success from Meta, the message status is updated to `SENT` or `DELIVERED` in the database.

---

## 3. Tech Stack Components in the Flow

| Layer | Responsibility | Key Tools |
| :--- | :--- | :--- |
| **Request Handling** | Routing, Validation, Middleware | Express, Express-Validator |
| **Business Logic** | Calculations, Sequencing, External APIs | Services Layer |
| **Database ORM** | Schema safety, Relationships, Transactions | Prisma |
| **State Management** | Global App State (Auth, UI controls) | Zustand |
| **Server Sync** | Data fetching, Caching, Invalidation | TanStack Query (React Query) |
| **Security** | Auth, Hashing, Permissions | JWT, Bcrypt, Role Middleware |

---

## 4. Entity-Relationship Summary (Direct Flows)
*   **User -> AuditLog**: Every admin action generates a trace.
*   **Lead -> Activity**: Every status change or assignment creates a timeline event.
*   **Conversation -> Message**: One-to-many relationship; messages are grouped by conversation (lead + channel).
*   **Lead -> AIQualification**: Bots qualify leads and store structured JSON data before human handoff.
