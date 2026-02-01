# Sampada - Finance Tracker (BackEnd API)

The robust RESTful API backend for the Sampada application, built with **Java** and **Spring Boot**. It handles secure authentication, data persistence, and complex business logic for managing expenses and budgets.

## 🚀 Tech Stack

* **Framework:** Spring Boot 3 (Web, Security, Validation)
* **Database:** MySQL
* **ORM:** Spring Data JPA (Hibernate)
* **Security:** Spring Security + JWT (JSON Web Tokens)
* **Build Tool:** Maven

## ✨ Key Features

### 🔐 Security Architecture
* **Stateless Authentication:** Implemented using **JWT (jjwt)** filters.
* **Password Encryption:** BCrypt hashing for user passwords.
* **Role-Based Access:** Granular permission controls (Configured in SecurityFilterChain).
* **CORS Configuration:** Securely configured to allow requests from the React frontend.

### 📡 API Capabilities
* **RESTful Endpoints:** Structured resources for Expenses, Categories, Budgets, and Users.
* **Exception Handling:** Global exception handler for consistent error responses.

### 💾 Data Management
* **Relational Schema:** Optimized MySQL schema with relationships between Users, Expenses, and Categories.
* **JPA Repositories:** Efficient data access patterns.

## 🛠️ Setup & Installation

### Prerequisites
* Java 17 or higher
* Maven
* MySQL Server

### Configuration

1.  **Database Setup**
    Create a MySQL database named `expensetracker`:
    ```sql
    CREATE DATABASE expensetracker;
    ```

2.  **Application Properties**
    Update `src/main/resources/application.properties` with your database credentials:

    ```properties
    # Database Configuration
    spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
    spring.jmx.enabled=false

    # JWT Configuration
    application.security.jwt.secret-key=YOUR_SUPER_SECRET_256_BIT_KEY
    application.security.jwt.expiration=3600000
    ```

3.  **Run the Application**
    ```bash
    mvn spring-boot:run
    ```

## 🔌 API Endpoints

### 🔐 Authentication & User
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new user account. |
| `POST` | `/auth/login` | Authenticate user and receive a JWT token. |
| `POST` | `/auth/forgotPassword` | Initiate the password reset flow. |
| `POST` | `/auth/updateUser` | Update user profile (Name, Email, etc.). |

### 💰 Expenses
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/expenses/getAllExpenses` | Retrieve all expenses with **pagination**. |
| `GET` | `/expenses/getCurrentExpenses/{userId}` | Get current month's expense data. |
| `GET` | `/expenses/getSixMonthsExpenses/{userId}` | Fetch 6-month trend for dashboard charts. |
| `GET` | `/expenses/getCustomExpenses/{userId}/{duration}` | Historical data (1 to 12 years). |
| `POST` | `/expenses/addExpenses` | Create a new expense record. |
| `POST` | `/expenses/updateExpense` | Update existing expense details. |
| `DELETE` | `/expenses/deleteExpense/{id}` | Permanently remove an expense record. |

### 🎯 Budgets
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/budgets/getBudgets/{userId}` | Fetch all category-wise budgets for a user. |
| `POST` | `/budgets/addBudget` | Set a monthly budget limit for a category. |
| `POST` | `/budgets/updateBudget` | Modify an existing budget limit. |

### 🏷️ Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/category/getCategories/{userId}` | Get custom categories with icons and colors. |
| `POST` | `/category/addCategory` | Create a new custom expense category. |
| `POST` | `/category/updateCategory` | Edit category metadata. |
| `DELETE` | `/category/deleteCategory/{id}` | Remove a category. |

---

## 📄 License

This project is licensed under the MIT License.