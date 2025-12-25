# 🛡️ ShieldVault: Vulnerability Management System

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**ShieldVault** is a premium, high-security vulnerability management portal designed for cybersecurity professionals. It provides a sleek, "hacker-themed" interface to track security findings, manage technical assessments, and maintain a robust audit trail for digital infrastructures.

### 🌐 Live Deployment: [https://cyber-issue-portal.vercel.app/](https://cyber-issue-portal.vercel.app/)

---

## 📊 SEO & Performance

We achieved a **90+ SEO Score** and high performance metrics across both mobile and desktop.

![SEO Lighthouse Score](./public/SEO.png)

---

## 🏗️ System Architecture & Workflow

### 🔄 Project Execution Flow

The following diagram illustrates how a request moves through the system, from the user's browser to the persistent data layers.

```mermaid
graph TD
    A[User Browser] -->|Interaction| B(Next.js Frontend)
    B -->|API Request| C{API Dispatcher}
    C --> D[Rate Limiter Middleware]
    D -->|Persistent Cache| E[(Redis / Cloud Cache)]
    D --> F[Auth Middleware]
    F -->|JWT Validation| G[Domain Controller]
    G --> H[Business Logic Service]
    H --> I[Data Repository]
    I --> J[(Prisma ORM)]
    J --> K[(Supabase PostgreSQL)]
    H --> L[Resend Email Service]

    style B fill:#00FFB2,stroke:#000,stroke-width:2px,color:#000
    style K fill:#316192,stroke:#fff,color:#fff
    style E fill:#DC382D,stroke:#fff,color:#fff
```

### 🧩 Backend OOP Architecture

The backend is built using a strict **Object-Oriented Programming (OOP)** approach, ensuring separation of concerns and scalability through a layered architecture.

```mermaid
graph LR
    subgraph "Request Lifecycle"
        REQ[Incoming Request] --> RL[Rate Limiter Middleware]
        RL -->|Check Redis| REDIS[(Redis Cache)]
        RL --> AUTH[Auth Middleware]
        AUTH -->|JWT Verify| DISP[API Dispatcher]
    end

    subgraph "Presentation Layer (Controllers)"
        DISP --> CTRL[Domain Controllers]
        CTRL -->|Handle Req/Res| CTRL
    end

    subgraph "Business Layer (Services)"
        CTRL --> SVC[Domain Services]
        SVC --> VAL[Validators]
        SVC --> MAIL[Email Service]
    end

    subgraph "Data Layer (Repositories)"
        SVC --> REPO[Repositories]
        REPO --> DB[(Prisma / PostgreSQL)]
    end

    style REDIS fill:#DC382D,color:#fff
    style DB fill:#316192,color:#fff
    style REQ fill:#00FFB2,color:#000
    style RL fill:#1A1A1A,color:#00FFB2
    style AUTH fill:#1A1A1A,color:#00FFB2
```

---

## 🚀 Key Features

- **🔐 Enterprise Authentication**: Secure login/registration with JWT stored in HTTP-only cookies and bcrypt password hashing.
- **🛡️ Multi-Level Rate Limiting**: Intelligent API throttling using Redis to prevent brute-force attacks and resource exhaustion.
- **📁 Engagement Management**: Group vulnerability findings under specific projects/clients for better organization.
- **📊 Tactical Dashboard**: Real-time overview of security risks with filtering by vector (Cloud, Red Team, VAPT).
- **📧 Automated Notifications**: Instant email alerts via Resend when new critical findings are logged.
- **✨ Premium UI/UX**: Dark-mode primary design with glassmorphism, micro-animations, and custom-engineered components.

---

## 🛠️ Technology Stack

| Component        | Technology                           |
| :--------------- | :----------------------------------- |
| **Framework**    | Next.js 15 (App Router)              |
| **Language**     | TypeScript (Strict Mode)             |
| **Database**     | PostgreSQL via Supabase              |
| **ORM**          | Prisma                               |
| **Styling**      | Tailwind CSS + Vanilla CSS Variables |
| **Auth**         | JWT (jsonwebtoken) + bcryptjs        |
| **Icons**        | Lucide React                         |
| **Email**        | Resend API                           |
| **Rate Limiter** | Redis (ioredis) / In-Memory Fallback |

---

## ⚙️ Quick Start

1. **Clone & Install**:

   ```bash
   git clone https://github.com/rohanparmar160705/cyber-issue-portal
   cd cyber-issue-portal
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on `.env.example`:

   ```env
   DATABASE_URL="your-supabase-url"
   DIRECT_URL="your-supabase-direct-url"
   JWT_SECRET="your-secret"
   RESEND_API_KEY="your-key"
   REDIS_URL="your-redis-url"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Database Sync**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Launch Application**:
   ```bash
   npm run build
   npm run dev
   ```

---

## 📞 Security & Contact

This project follows strictly secure coding practices. For any security inquiries or vulnerability reports regarding the portal itself, please contact the lead developer.

---

_Created with ❤️ by the Rohan Parmar._
