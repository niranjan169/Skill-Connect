# Solaris Skill Connect 🌌

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Solaris-Verified-blueviolet)](https://github.com/niranjan169/Skill-Connect)

**Solaris Skill Connect** is a premium, full-stack talent acquisition ecosystem built on a "Neo-Glassmorphism" design philosophy. It bridges the gap between elite engineering talent and enterprise opportunities through high-precision candidate matching and a real-time analytics engine.

---

## 💎 Project Philosophy
Designed with the **Solaris Design System**, this platform moves away from generic UI into a futuristic, immersive workspace. Every interaction is designed to feel alive, using smooth radial gradients, backdrop blurs, and micro-animations to enhance the recruiter and candidate experience.

## 🕹️ Solaris Operational Workflows

### 👤 Candidate Journey
1.  **Identity Creation**: Register / Login to the Solaris Network.
2.  **Discovery**: Browse the global job matrix.
3.  **Refinement**: Filter by Capabilities (Skills), Location, Experience, and Engagement Type.
4.  **Preservation**: Save high-interest positions (❤️) for later acquisition.
5.  **Intelligence Check**: View real-time **Match Percentage (%)** and **Skill Gap Suggestions**.
6.  **Transmission**: Apply with Hosted Resume URL and supplementary credentials.
7.  **Tracking**: Monitor progress through the standard pipeline: `Applied ⏳` → `Shortlisted ✅` → `Rejected ❌` → `Selected 🎉`.

### 🏢 Recruiter Journey
1.  **Principal Setup**: Register / Login and define Company Profile.
2.  **Broadcasting**: Post Positions with precise Capability requirements.
3.  **Acquisition**: View incoming applicants ranked by **Solaris Match Engine**.
4.  **Curation**: Filter candidates and review Intelligence Gaps.
5.  **Intelligence Notes**: Add recruiter-specific comments to candidate profiles.
6.  **Pipeline Management**: Advance candidates through Shortlist, Reject, or Select phases.

### 🛡️ Admin Oversight
1.  **Command Center**: Access the main Dashboard for ecosystem health (Total Users, Jobs, Apps).
2.  **Talent Policing**: Manage Applicants (View, Block/Activate).
3.  **Broadcast Quality**: Manage Job Listings (Approve/Delete).
4.  **Log Intelligence**: Monitor the system-wide Audit Log for all security-relevant actions.

## 🚀 Key Intelligence Features

### 🧠 Applicant Intelligence Matrix
- **Automated Skill-Gap Analysis**: Candidates receive real-time feedback on "Missing Capabilities" when viewing job descriptions.
- **Precision Matching**: A custom-weighted matching engine ranks candidates based on their technical overlap with specific job requirements.
- **Dynamic Skill Verification**: Integrated skill tagging for both users and recruiters.

### 🛡️ Enterprise Stability
- **Stabilized Routing**: Hardened navigation with a robust `ProtectedRoute` architecture.
- **Real-Time Dashboards**: Bi-directional data synchronization for both Candidates (applications, saved jobs) and Recruiters (applicant counts, active positions).
- **Security-First**: Spring Security JWT state management ensures total data isolation.

---

## 📂 Repository Architecture
This is a unified project structure (Monorepo) designed for clean separation of concerns:

```text
/ Skill-Connect
├── frontend/          # React + Vite + Solaris UI Framework
├── backend/           # Spring Boot + REST API + PostgreSQL
├── LICENSE            # MIT Rights
└── README.md          # Primary Documentation
```

---

## 🛠️ Technical Fabric

### Frontend Core
- **React 18** & **Vite**: Ultra-fast module bundling.
- **Solaris CSS Engine**: Custom Vanilla CSS system for high-performance glassmorphic effects.
- **React Router 6**: Advanced nested routing and nav hierarchy.
- **React Hot Toast**: Instant feedback loops for all system interactions.

### Backend Core
- **Java 17** & **Spring Boot 3**: High-performance enterprise backbone.
- **Spring Security + JWT**: Stateless authentication layer.
- **Hibernate / JPA**: Advanced ORM for complex data relationships.
- **PostgreSQL**: Robust, relational data persistence.

---

## ⚡ Quick Start: Ignite the Solaris Engine

### Backend Initialization
1. Navigate to `/backend`.
2. Ensure you have a **PostgreSQL** instance named `luzo_db`.
3. Update `application.properties` with your database credentials.
4. Run `./mvnw spring-boot:run` or launch through Maven.

### Frontend Initialization
1. Navigate to `/frontend`.
2. Execute `npm install` to synchronize the dependency matrix.
3. Execute `npm run dev` to launch the HMR development server.
4. Access the portal at `http://localhost:5173`.

---

## 🛸 Design & Documentation
The system uses the **Solaris Neo-Glassmorphism** framework. For detailed component documentation and API endpoints, refer to the source files within each sub-directory.

---

*Authored by **Niranjan** | Part of the Advanced AI Coding Initiative.*