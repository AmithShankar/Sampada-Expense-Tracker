---

# 💸 Sampada - Full-Stack Expense Tracker

**Sampada** (Sanskrit for *Wealth* and *Prosperity*) is a modern FinTech orchestrator designed to provide deep insights into spending habits. It bridges the gap between daily expenses and long-term financial goals through advanced analytics and high-performance engineering.

## 🏗️ Technical Architecture

The system is built on a decoupled full-stack architecture, ensuring a smooth, app-like experience on the frontend while maintaining a hardened, transactional core on the backend.

* **Frontend Architecture:** Leveraging **React Query** for intelligent server-state caching and **Zustand** for lightweight global UI management.
* **Backend Architecture:** A secure **Spring Boot** REST API utilizing **Spring Data JPA** for robust persistence and **Spring Security** for JWT-based stateless authentication.
* **Analytics Engine:** Custom aggregation logic capable of processing financial data across variable timelines, from current-month views to 12-year historical trends.

---

## 📂 Documentation Modules

Click below to explore the deep technical setup, dependency lists, and implementation details for each layer:

| Module | Purpose | Tech Highlights | Documentation |
| --- | --- | --- | --- |
| **🚀 FrontEnd** | User Interface & Client Logic | React, Vite, Shadcn UI, Recharts | **[View FrontEnd README](https://github.com/AmithShankar/Sampada---Finance-Tracker/tree/main/FrontEnd#readme)** |
| **⚙️ BackEnd** | API Service & Security | Spring Boot, JWT, Hibernate, MySQL | **[View BackEnd README](https://github.com/AmithShankar/Sampada---Finance-Tracker/tree/main/BackEnd#readme)** |

---

## ✨ Key Technical Features

* **📈 Multi-Timeline Analytics:** Specialized endpoints to fetch 6-month trends and custom year-over-year data (1–12 years).
* **🎯 Budget Orchestration:** Real-time budget monitoring with status indicators (On Track, Near Limit, Over Budget).
* **🔐 Hardened Security:** Stateless JWT authentication with secure password hashing and protected API routing.
* **🎨 Premium UI/UX:** Fully responsive dashboard built with **Shadcn UI** and **Tailwind CSS**, featuring Dark/Light mode support.
* **⚡ High Performance:** Implementation of server-side pagination and optimized JPA queries to handle large transaction volumes.

---

## 🛠️ Project Structure

```text
Sampada-Expense-Tracker/
├── FrontEnd/                # React (Vite) Application
│   ├── src/
│   │   ├── components/      # Reusable UI (Shadcn)
│   │   ├── pages/           # Custom React Query hooks
│   │   ├── context/         # Zustand global state
│   │   └── components/api   # API/Axios configuration
├── BackEnd/                 # Spring Boot API
│   ├── src/main/java/
│   │   ├── api/      		 # REST Endpoints
│   │   ├── service/         # Business logic & Calculations
│   │   ├── security/        # JWT & Security filters
│   │   └── repository/      # JPA Entities
└── README.md                # Root Documentation

```

---

## 👤 Lead Developer

**Amith Shankar K M**
*Front-End Developer (React.js) with a focus on enterprise solutions.*

---

## 📄 License

This project is licensed under the MIT License

---
