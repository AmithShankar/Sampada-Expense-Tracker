# Sampada - Finance Tracker (FrontEnd)

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

## 📸 Screenshots
![Login](https://github.com/user-attachments/assets/b4343e7a-2af4-454c-b17d-4edc42cfb8d9)

![Dashboard](https://github.com/user-attachments/assets/0aaf3876-a6ee-4ddb-8983-9d712f4eea61)

![Expenses](https://github.com/user-attachments/assets/5199dece-258d-4d34-89ef-dd2c0c42aeb6)

![Analytics](https://github.com/user-attachments/assets/49ddc01c-4ca2-48d5-933d-186542601e6e)

![Budgets](https://github.com/user-attachments/assets/f7f89743-94d4-4e95-85b2-0afe76260b3c)

![Categories](https://github.com/user-attachments/assets/25e5214e-f062-45cb-b833-2a76ec0b1f14)

## 📄 License


This project is licensed under the MIT License.
