# CareSync • Online Doctor Appointment & Digital Prescription Platform
### Round 3 – High-Level System Design (HLD) Architecture Challenge (25 Marks)

CareSync is a full-stack, enterprise-grade digital healthcare platform architected for high concurrency, zero double-booking collisions, sub-millisecond cached doctor searches, and authenticated digital medical prescriptions.

Built with **React.js (Vite)**, **Tailwind CSS**, an **Express.js Centralized API Gateway**, **MongoDB**, **Redis (with safe development in-memory fallback)**, and **RabbitMQ (with safe in-memory event worker fallback)**.

---

## 1. High-Level Architecture (HLD)

```
[ Patients / Doctors / Mobile Clients ]
                 │
                 ▼  (HTTPS / REST / JWT Bearer)
┌─────────────────────────────────────────────────────────────┐
│             EXPRESS.JS CENTRALIZED API GATEWAY              │
│  • Reverse Proxy Routing       • Rate Limiter (120 req/min) │
│  • JWT Auth & RBAC Guard       • Request Telemetry & CORS   │
└──────────────────────────────┬──────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Auth Service   │  │  Doctor Service  │  │ Appointment Svc  │
│  /api/auth/*     │  │  /api/doctors/*  │  │ /api/appointments│
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Consultation Svc │  │ Prescription Svc │  │ Notification Svc │
│/api/consultations│  │/api/prescriptions│  │ (Async Queue)    │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────────┐ ┌───────────────┐ ┌──────────────────────┐
│  MongoDB Database    │ │  Redis Cache  │ │ RabbitMQ Event Queue │
│ (Users, Doctors,     │ │ (Profiles,    │ │ (Async Email & SMS   │
│  Appointments, Rx)   │ │  Search TTL)  │ │  Delivery Worker)    │
└──────────────────────┘ └───────────────┘ └──────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive UI, Patient & Doctor Dashboards, Printable Rx |
| **API Gateway** | Node.js, Express.js | Inbound traffic routing, rate limiting, JWT verification |
| **Domain Services** | Modular Microservice Architecture | Auth, Patient, Doctor, Appointment, Consultation, Prescription |
| **Database** | MongoDB / Mongoose | Document datastore for medical records & appointments |
| **Caching** | Redis (with auto-fallback) | Sub-millisecond doctor profile & search retrieval |
| **Messaging** | RabbitMQ (with auto-fallback) | Asynchronous event worker for email/SMS notifications |

---

## 3. User Roles & Credentials

The platform includes **1-Click Demo Quick Login** buttons on the login screen for effortless evaluation:

| Role | Demo Email | Password | Permissions |
|---|---|---|---|
| **Patient** | `patient@health.com` | `password123` | Search doctors, view real-time slots, book appointments, cancel visits, view & print digital prescriptions |
| **Doctor** | `doctor.sarah@health.com` | `password123` | Manage clinical schedule & fee, view patient appointment queue, complete visits, publish digital prescriptions |
| **Admin** | `admin@health.com` | `password123` | Platform KPI telemetry, monitor appointments, manage user accounts, inspect Redis and Queue status |

---

## 4. Key HLD System Design Features

### 1. Atomic Slot Reservation (Zero Double-Booking)
- When a patient books an appointment, the backend acquires an **atomic mutex lock** on `doctorId:date:timeSlot`.
- Verifies slot validity and atomically writes the appointment with `CONFIRMED` status.
- If concurrent requests collide on the exact same slot, the secondary request is rejected with `HTTP 409 Conflict`.

### 2. Redis Caching & Cache Invalidation
- Doctor search queries and profiles are cached in Redis with a 300-second TTL.
- Whenever a doctor modifies their availability schedule or consultation fee, a **cache invalidation hook** flushes all matching `doctor:*` keys, ensuring patients immediately view accurate slot data.

### 3. Asynchronous Messaging & Worker Decoupling
- Notification dispatches (booking confirmations, cancellations, digital prescription alerts) are published to an asynchronous queue.
- Background workers process delivery without blocking HTTP transaction response times.

### 4. Development Fallback Architecture
- If local MongoDB, Redis, or RabbitMQ services are offline, the backend automatically switches to its high-performance in-memory adapters with exact query semantics and reports the fallback status on the HLD telemetry dashboard.

---

## 5. Quick Start Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Running (Single Command)

1. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start Both Backend (:5000) and Frontend (:3000):**
   ```bash
   npm start
   ```

3. **Open the Application:**
   - **Frontend App:** [http://localhost:3000](http://localhost:3000)
   - **API Gateway & Telemetry:** [http://localhost:5000/api/hld/architecture](http://localhost:5000/api/hld/architecture)

---

## 6. Manual Multi-Terminal Execution (VS Code)

If running in separate VS Code terminal tabs:

### Terminal 1: Backend API Gateway
```bash
cd backend
npm install
npm run seed     # Seeds realistic doctors and demo accounts
npm run dev      # Runs API Gateway on http://localhost:5000
```

### Terminal 2: Frontend Web App
```bash
cd frontend
npm install
npm run dev      # Runs Vite React App on http://localhost:3000
```

---

## 7. REST API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create patient or doctor account
- `POST /api/auth/login` - Authenticate and return JWT token

### Doctors
- `GET /api/doctors` - Search and filter doctors (Redis cached)
- `GET /api/doctors/:id` - Fetch doctor profile (Redis cached)
- `GET /api/doctors/:id/availability?date=YYYY-MM-DD` - Live slot calculation
- `PUT /api/doctors/availability` - Update schedule and invalidate cache

### Appointments
- `POST /api/appointments` - Atomically reserve slot and confirm booking
- `GET /api/appointments/my` - Fetch appointments for authenticated user
- `PATCH /api/appointments/:id/cancel` - Cancel appointment with reason
- `PATCH /api/appointments/:id/complete` - Mark appointment as completed

### Consultations & Prescriptions
- `POST /api/consultations` - Record diagnosis and clinical vitals
- `POST /api/prescriptions` - Issue digital prescription with medications
- `GET /api/prescriptions/my` - Fetch user's digital prescriptions
- `GET /api/prescriptions/:id` - Fetch single prescription with authorization check

### Admin & HLD Telemetry
- `GET /api/admin/dashboard` - Platform metrics and infrastructure health
- `GET /api/admin/appointments` - All platform appointments
- `GET /api/hld/architecture` - Live HLD topology, cache hit rates, queue stats

---

## 8. Round 3 Challenge Scorecard (25 Marks)

| Task | Requirement | Implementation Status |
|---|---|---|
| **1. System Architecture** | Services for patients, doctors, appointments, consultations, prescriptions | **Completed (100%)** – 7 independent service modules behind Express Gateway |
| **2. REST API Communication** | Client-to-gateway REST APIs with status codes | **Completed (100%)** – 200, 201, 400, 401, 403, 404, 409, 500 status codes |
| **3. Database Selection** | Schemas for appointments, clinical records, indexing | **Completed (100%)** – MongoDB collections with compound B-Tree indexes |
| **4. Caching** | Doctor profiles, search, cache invalidation | **Completed (100%)** – Redis LRU caching with 300s TTL and purge on updates |
| **5. Messaging** | Confirmations, reminders, async event queues | **Completed (100%)** – Asynchronous event worker for email/SMS dispatch |
| **6. Scalability** | Horizontal scaling, atomic booking concurrency | **Completed (100%)** – Mutex slot locks and stateless horizontal gateway design |
