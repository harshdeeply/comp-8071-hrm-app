# HRMApp – Human Resource Management Backend

## 📋 Overview

HRMApp is a backend API built with **ASP.NET Core 8** designed to manage key HR functionalities including employee records, timesheets, payroll, leave requests, and user authentication with JWT-based security.

This project follows clean architecture principles and uses a SQL Server database.

---

## 🚀 Features

* User registration and login with role-based access control (RBAC)
* Employee and department management
* Leave request handling
* Timesheet tracking
* Payroll data
* JWT Authentication for API security

---

## 🛠️ Technologies Used

* **.NET 8 / ASP.NET Core**
* **Entity Framework Core**
* **SQL Server**
* **Docker / Docker Compose**
* **JWT Authentication**
* **RESTful API Design**

---

## 📁 Folder Structure

```
HRMApp/
│
├── Controllers/        # API Controllers
├── Models/             # Entity models
├── Models/DTOs/        # Data Transfer Objects
├── Services/           # Business logic services
├── Data/               # EF DbContext and Migrations
├── Migrations/         # Migrations
├── appsettings.json    # Configuration
└── Program.cs          # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)

### 2. Clone the Repository

```bash
git clone https://github.com/harshdeeply/comp-8071-hrm-app.git
cd comp-8071-hrm-app
```

### 3. Run via dotnet build

```bash
dotnet build
dotnet path_to_dll/HRMApp.dll 
```

> The API will be accessible at `http://localhost:5268`.

---

## 🔐 Authentication

* JWT tokens are issued during login
* Roles include: `Admin`, `Manager`, `Employee`, etc.

To test protected endpoints:

* Use the `/login` endpoint to receive a token
* Include the token in `Authorization` headers:

  ```
  Authorization: Bearer <your-token>
  ```

---

## 🧪 Testing

You can test the endpoints using:

* Postman
* Swagger
* Curl

---

## 📌 Notes

* Be sure to use a secure JWT secret key in production
* HTTPS should be enforced in real deployments
* This app uses simple RBAC; can be extended with claims-based auth

---

## 📖 License

MIT License