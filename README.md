# 💸 Sampada - Full-Stack Expense Tracker

**Sampada** (Sanskrit for _Wealth_ and _Prosperity_) is a high-performance personal finance orchestrator. It transforms raw transaction data into actionable financial clarity through a reactive, state-optimized frontend and a secure, hardened Spring Boot backend.

## 🏗️ Technical Architecture

The application follows a decoupled client-server architecture. The frontend focuses on optimistic UI updates and efficient caching, while the backend ensures ACID-compliant transactions and stateless security.

- **Presentation Layer:** React 18 (Vite) with **Shadcn UI**.
- **State Management:** Hybrid approach using **Zustand** (UI-state) and **React Query** (server-state caching).
- **API Layer:** RESTful Spring Boot services with specialized endpoints for high-volume data aggregation.
- **Security Layer:** JWT-based stateless authentication with password hashing and protected resource filters.

---

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://sampada.amithshankar.in/)

---

## 📂 Documentation Modules

Explore the deep technical setup, dependency lists, and implementation details for each layer:

| Module          | Purpose                       | Tech Highlights                    | Documentation                                                                                                 |
| --------------- | ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **🚀 FrontEnd** | User Interface & Client Logic | React, Vite, Shadcn UI, Recharts   | **[View FrontEnd README](https://github.com/AmithShankar/Sampada-Expense-Tracker/tree/main/FrontEnd#readme)** |
| **⚙️ BackEnd**  | API Service & Security        | Spring Boot, JWT, Hibernate, MySQL | **[View BackEnd README](https://github.com/AmithShankar/Sampada-Expense-Tracker/tree/main/BackEnd#readme)**   |

---

## ✨ Key Technical Features

- **📈 Multi-Timeline Analytics:** Specialized endpoints to fetch 6-month trends and custom year-over-year data (1–12 years).
- **🎯 Budget Orchestration:** Real-time budget monitoring with status indicators (On Track, Near Limit, Over Budget).
- **🔐 Hardened Security:** Stateless JWT authentication with secure password hashing and protected API routing.
- **⚡ High Performance:** Implementation of server-side pagination and optimized JPA queries to handle large transaction volumes.
- **🎨 Premium UI/UX:** Fully responsive dashboard built with **Tailwind CSS**, featuring Dark/Light mode support.

---

## 🛠️ Project Structure

```text
Sampada-Expense-Tracker/
├── FrontEnd/                 # React (Vite) Application
│   ├── src/
│   │   ├── components/       # Reusable UI (Shadcn UI)
│   │   ├── pages/            # Application Views
│   │   ├── context/          # Zustand global state management
│   │   └── components/api/   # Axios instance & interceptors
├── BackEnd/                  # Spring Boot API
│   ├── src/main/java/
│   │   ├── controller/       # REST Endpoints
│   │   ├── service/          # Business logic & Calculations
│   │   ├── security/         # JWT & Security filters
│   │   ├── repository/       # Data Access Layer (JPA)
│   │   ├── entity/           # Entities
│   │   └── dto/              # DTOs
└── README.md                 # Root Documentation

```

## 📄 License

This project is licensed under the MIT License.

---
