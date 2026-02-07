![Expenses](https://github.com/user-attachments/assets/5f79957b-a62d-4829-8eff-fad3a1a1e712)# Sampada - Finance Tracker (FrontEnd)

A modern, responsive expense tracking application built with **React** and **Vite**. This application features a comprehensive dashboard, detailed analytics, budget management, and secure authentication, wrapped in a polished UI using **Shadcn UI** and **Tailwind CSS**.

## ✨ Features

### 🔐 Authentication & Security
* **JWT Authentication:** Secure login and registration flows.
* **User Management:** Sign up with email confirmation, Password Reset flow, and Profile management.
* **Protected Routes:** Ensures sensitive data is only accessible to authenticated users.

### 📊 Dashboard & Analytics
* **Visual Data:** Interactive charts powered by **Recharts** (Trend lines, Pie charts).
* **Key Metrics:** Instant view of total expenses, daily averages, and budget health.
* **Date Filtering:** Analyze data by month, year, or custom date ranges.

### 💰 Expense Management
* **Advanced Data Table:** Built with **TanStack Table** supporting sorting, pagination, and filtering.
* **CRUD Operations:** Add, update, and delete expenses with ease.
* **Smart Filters:** Filter by category, payment method, date, and amount range.

### 🎯 Budgets & Categories
* **Budget Tracking:** Set monthly limits per category and track progress.
* **Custom Categories:** Create and manage categories with custom colors and icons.
* **Visual Indicators:** Color-coded status for budgets (On Track, Near Limit, Over Budget).

### ⚙️ UI/UX Excellence
* **Responsive Design:** Fully responsive sidebar and layout for all devices.
* **Dark Mode:** Built-in theme switching (Dark/Light).
* **Form Validation:** Robust forms using **React Hook Form** and **Zod**.
* **Feedback:** Toast notifications using **Sonner** for user actions.

## 🛠️ Tech Stack

* **Core:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/) (Recommended)
* **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives), [Lucide React](https://lucide.dev/) (Icons)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Global Store), [TanStack Query](https://tanstack.com/query/latest) (Server State)
* **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
* **Visualization:** [Recharts](https://recharts.org/) (Charts), [TanStack Table](https://tanstack.com/table) (Data Grids)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Utilities:** [Date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📸 App Walkthrough & UI

### 🔐 Secure Onboarding
![Login](https://github.com/user-attachments/assets/2a418c00-4450-4a28-b8ce-df1e29c41bc5)
*The authentication gateway features a clean, focused UI with JWT-protected sessions and secure password handling.*

### 📊 Intelligence Dashboard
![Dashboard](https://github.com/user-attachments/assets/ca6be8f7-e754-47ad-b239-2a61adec1c4b)
*High-level financial overview featuring dynamic stat cards, recent transactions, and a 6-month spending trend chart.*

### 💰 Expense Orchestration
![Expenses](https://github.com/user-attachments/assets/9911ca85-5499-4b07-a4e0-e5f4b6e23da8)
*Advanced data table implementation with server-side pagination, sorting, and granular filtering by category or date.*

### 📈 Deep Analytics
![Analytics](https://github.com/user-attachments/assets/c0ed9716-4c8c-436a-882d-1e4b0e741ef0)
*Visualization of spending patterns across custom timelines, allowing for long-term expense analysis.*

### 🎯 Budget & Category Management
![Budgets](https://github.com/user-attachments/assets/94dc786f-b20a-4dda-a16b-1b9cca87e8cc)
![Categories](https://github.com/user-attachments/assets/89ef038d-c2c5-4170-8d51-30b67493401c)
*User-centric tools to define custom spending buckets and monitor budget health through visual progress indicators.*

## 📄 License
This project is licensed under the MIT License.


